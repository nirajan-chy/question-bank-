const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PastPaper = sequelize.define(
    "PastPaper",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      title: { type: DataTypes.STRING, allowNull: false },
      subjectSlug: { type: DataTypes.STRING, allowNull: false },
      subjectName: { type: DataTypes.STRING, allowNull: false },
      level: { type: DataTypes.STRING, allowNull: false },
      courseSlug: { type: DataTypes.STRING, allowNull: true },
      semester: { type: DataTypes.INTEGER, allowNull: true },
      year: { type: DataTypes.INTEGER, allowNull: false },
      exam: { type: DataTypes.STRING, allowNull: false },
      board: { type: DataTypes.STRING, allowNull: false },
      duration: { type: DataTypes.STRING, allowNull: false },
      fullMarks: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      passMarks: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      downloads: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      format: {
        type: DataTypes.ENUM("PDF"),
        allowNull: false,
        defaultValue: "PDF",
      },
      // "pdf" (legacy/default — file at pdfUrl) or "markdown" (text at contentPath)
      contentType: {
        type: DataTypes.STRING(16),
        allowNull: false,
        defaultValue: "pdf",
      },
      contentPath: { type: DataTypes.STRING(512), allowNull: true },
      pdfUrl: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: false },
      tags: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    },
    { tableName: "past_papers", timestamps: true }
  );

  return PastPaper;
};
