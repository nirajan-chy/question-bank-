const userCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

function getCachedUser(id) {
  const entry = userCache.get(id);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    userCache.delete(id);
    return null;
  }
  return entry.user;
}

function setCachedUser(id, user) {
  userCache.set(id, { user, ts: Date.now() });
}

function invalidateUser(id) {
  userCache.delete(id);
}

module.exports = { getCachedUser, setCachedUser, invalidateUser };
