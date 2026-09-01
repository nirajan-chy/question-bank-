const nodemailer = require("nodemailer");
const { Contact } = require("../models");
const { createBaseController } = require("./base.controller");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendSuccess = require("../utils/sendSuccess");
const { SMTP_USER, SMTP_PASSWORD } = require("../config/dotenv");

const controller = createBaseController(Contact, {
  slugField: "id",
  searchFields: ["name", "email", "subject", "message"],
});

const sendEmail = async ({ name, email, subject, message }) => {
  if (!SMTP_USER || !SMTP_PASSWORD) {
    console.log("ℹ️ SMTP credentials missing — skipping email notification.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  await transporter.sendMail({
    from: SMTP_USER,
    to: SMTP_USER,
    replyTo: email,
    subject: `[Sandarbh] ${subject || "New contact message"} from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  });
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createContact = asyncHandler(async (req, res) => {
  const { name, email, subject = "", message } = req.body;
  if (!name || !email || !message) {
    throw new ApiError(400, "name, email and message are required");
  }
  if (!EMAIL_RE.test(email)) {
    throw new ApiError(400, "Please provide a valid email");
  }

  const contact = await Contact.create({ name, email, subject, message });

  sendEmail({ name, email, subject, message }).catch((err) =>
    console.error("❌ Email notification failed:", err.message)
  );

  sendSuccess(res, contact, 201, "Message sent — we'll reply within 24 hours");
});

module.exports = {
  ...controller,
  createContact,
};
