const router = require("express").Router();
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const models = require("../models");

/**
 * GET /api/pdf/:slug
 *
 * Proxies a note's PDF from Cloudinary through our server.
 * Students hit ourwebsite.com/api/pdf/dbms-unit-1 and never see the Cloudinary URL.
 */
router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const { slug } = req.params;

    // Try finding the note by slug
    const note = await models.Note.findOne({ where: { slug } });
    if (!note) throw new ApiError(404, "Note not found");
    if (!note.pdfUrl) throw new ApiError(404, "PDF not uploaded yet");

    const pdfUrl = note.pdfUrl;

    // If it's already a local file, redirect (existing behaviour)
    if (pdfUrl.startsWith("/uploads/")) {
      return res.redirect(pdfUrl);
    }

    // For Cloudinary or any external URL — proxy the response
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new ApiError(502, "Could not fetch PDF from storage");
    }

    // Stream the PDF to the client
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${note.title || slug}.pdf"`);
    res.setHeader("Cache-Control", "public, max-age=86400");

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  })
);

module.exports = router;
