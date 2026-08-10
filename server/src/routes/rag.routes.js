const express = require("express");
const multer = require("multer");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const sendSuccess = require("../utils/sendSuccess");
const { auth } = require("../middleware/auth");
const { proxyJson, proxyUpload, proxyStream } = require("../rag/ragProxy");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["pdf", "docx", "txt"];
    const ext = (file.originalname || "").split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Only PDF, DOCX and TXT files are allowed"));
    }
    cb(null, true);
  },
});

router.use(auth);

router.get("/documents", asyncHandler(async (req, res) => {
  const data = await proxyJson(req.user.id, "/documents");
  sendSuccess(res, data, 200, "Documents fetched");
}));

router.post("/documents", (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) return next(new ApiError(400, err.message || "Upload failed"));
    next();
  });
}, asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No file uploaded");
  const data = await proxyUpload(req.user.id, "/documents", req.file);
  sendSuccess(res, data, 201, "Document uploaded and indexed");
}));

router.delete("/documents/:id", asyncHandler(async (req, res) => {
  const data = await proxyJson(req.user.id, `/documents/${req.params.id}`, "DELETE");
  sendSuccess(res, data, 200, "Document deleted");
}));

router.post("/chat", asyncHandler(async (req, res) => {
  const { question, document_ids: documentIds, history } = req.body;
  if (!question || !String(question).trim()) {
    throw new ApiError(400, "question is required");
  }
  const data = await proxyJson(req.user.id, "/chat", "POST", { question, document_ids: documentIds, history });
  sendSuccess(res, data, 200, "Answered");
}));

router.post("/chat/stream", asyncHandler(async (req, res) => {
  const { question, document_ids: documentIds, history } = req.body;
  if (!question || !String(question).trim()) {
    throw new ApiError(400, "question is required");
  }
  await proxyStream(req, res, req.user.id, "/chat/stream", { question, document_ids: documentIds, history });
}));

router.get("/chat/history", asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const data = await proxyJson(req.user.id, "/chat/history", "GET", undefined, `?limit=${limit}`);
  sendSuccess(res, data, 200, "Chat history fetched");
}));

router.post("/mcq/generate", asyncHandler(async (req, res) => {
  const { count, difficulty, topics, document_ids: documentIds, notes } = req.body;
  if (!count || count < 1 || count > 20) throw new ApiError(400, "count must be between 1 and 20");
  if (!["easy", "medium", "hard"].includes(difficulty)) throw new ApiError(400, "difficulty must be easy, medium or hard");
  const data = await proxyJson(req.user.id, "/mcq/generate", "POST", {
    count,
    difficulty,
    topics: topics || null,
    document_ids: documentIds || null,
    notes: notes || null,
  });
  sendSuccess(res, data, 201, "Quiz generated");
}));

router.get("/mcq/:id", asyncHandler(async (req, res) => {
  const data = await proxyJson(req.user.id, `/mcq/${req.params.id}`);
  sendSuccess(res, data, 200, "Quiz fetched");
}));

router.post("/mcq/:id/submit", asyncHandler(async (req, res) => {
  const { answers } = req.body;
  if (!Array.isArray(answers)) throw new ApiError(400, "answers must be an array of option indices");
  const data = await proxyJson(req.user.id, `/mcq/${req.params.id}/submit`, "POST", { answers });
  sendSuccess(res, data, 200, "Quiz submitted");
}));

module.exports = router;
