const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const models = require("../models");

const { User } = models;

const PROVIDERS = {
  google: {
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
    scope: "openid email profile",
    clientId: () => process.env.GOOGLE_CLIENT_ID,
    clientSecret: () => process.env.GOOGLE_CLIENT_SECRET,
    parseUser: (data) => ({
      name: data.name || data.email?.split("@")[0] || "Google User",
      email: (data.email || "").toLowerCase(),
      avatar: data.picture || "",
    }),
  },
  github: {
    authorizeUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    userInfoUrl: "https://api.github.com/user",
    scope: "read:user user:email",
    clientId: () => process.env.GITHUB_CLIENT_ID,
    clientSecret: () => process.env.GITHUB_CLIENT_SECRET,
    parseUser: async (data) => {
      let email = (data.email || "").toLowerCase();
      if (!email) {
        const res = await fetch("https://api.github.com/user/emails", {
          headers: { Authorization: `Bearer ${data.token}`, "User-Agent": "Sandarbh" },
        });
        const emails = await res.json().catch(() => []);
        email = (Array.isArray(emails) ? emails.find((e) => e.primary && e.verified)?.email ?? emails[0]?.email : "") || "";
      }
      return {
        name: data.name || data.login || "GitHub User",
        email: email.toLowerCase(),
        avatar: data.avatar_url || "",
      };
    },
  },
};

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const pendingStates = new Map();

const signToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, "Server misconfigured: JWT_SECRET is not set in the environment");
  }
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const sanitize = (user) => user.get({ plain: true });

const getProvider = (provider) => {
  const config = PROVIDERS[provider];
  if (!config) throw new ApiError(404, `Unknown OAuth provider: ${provider}`);
  const clientId = config.clientId();
  const clientSecret = config.clientSecret();
  if (!clientId || !clientSecret) {
    throw new ApiError(
      500,
      `Server misconfigured: ${provider.toUpperCase()}_CLIENT_ID / ${provider.toUpperCase()}_CLIENT_SECRET are not set`
    );
  }
  return { ...config, clientId, clientSecret };
};

const oauthStart = (req, res, next) => {
  try {
    const config = getProvider(req.params.provider);
    const state = crypto.randomBytes(24).toString("hex");
    pendingStates.set(state, { provider: req.params.provider, expires: Date.now() + 10 * 60 * 1000 });

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: `${req.protocol}://${req.get("host")}/api/auth/${req.params.provider}/callback`,
      response_type: "code",
      scope: config.scope,
      state,
    });
    res.redirect(`${config.authorizeUrl}?${params.toString()}`);
  } catch (error) {
    next(error);
  }
};

const oauthCallback = async (req, res, next) => {
  const { provider } = req.params;
  const { code, state, error: providerError } = req.query;

  try {
    if (providerError) throw new ApiError(400, `OAuth failed: ${providerError}`);
    if (!code) throw new ApiError(400, "Missing authorization code");

    const stored = pendingStates.get(state);
    pendingStates.delete(state);
    if (!stored || stored.provider !== provider || stored.expires < Date.now()) {
      throw new ApiError(400, "Invalid or expired OAuth state");
    }

    const config = getProvider(provider);

    const redirectUri = `${req.protocol}://${req.get("host")}/api/auth/${provider}/callback`;
    const tokenParams = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const tokenRes = await fetch(config.tokenUrl, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenParams.toString(),
    });
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    if (!accessToken) throw new ApiError(401, "Failed to exchange authorization code");

    const infoRes = await fetch(config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "Sandarbh",
        Accept: "application/json",
      },
    });
    const infoData = await infoRes.json();
    const profile = await config.parseUser({ ...infoData, token: accessToken });

    if (!profile.email) throw new ApiError(400, `Could not fetch a verified email from ${provider}`);

    let user = await User.findOne({ where: { email: profile.email } });
    if (!user) {
      user = await User.create({
        name: profile.name,
        email: profile.email,
        password: crypto.randomBytes(32).toString("hex"),
        avatar: profile.avatar,
      });
    } else if (profile.avatar && !user.avatar) {
      await user.update({ avatar: profile.avatar });
    }

    const token = signToken(user);
    const redirectParams = new URLSearchParams({ token, user: JSON.stringify(sanitize(user)) });
    res.redirect(`${CLIENT_URL}/auth/callback?${redirectParams.toString()}`);
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "OAuth sign-in failed";
    res.redirect(`${CLIENT_URL}/auth/callback?error=${encodeURIComponent(message)}`);
  }
};

module.exports = { oauthStart, oauthCallback };
