const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const QuestionBank = sequelize.define(
    "QuestionBank",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      title: { type: DataTypes.STRING, allowNull: false },
      subjectSlug: { type: DataTypes.STRING, allowNull: false },
      subjectName: { type: DataTypes.STRING, allowNull: false },
      level: { type: DataTypes.STRING, allowNull: false },
      year: { type: DataTypes.INTEGER, allowNull: false },
      questions: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      difficulty: {
        type: DataTypes.ENUM("Easy", "Medium", "Hard"),
        allowNull: false,
        defaultValue: "Medium",
      },
      attempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      updatedAt: { type: DataTypes.DATEONLY, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      format: {
        type: DataTypes.ENUM("PDF", "Interactive", "Both"),
        allowNull: false,
        defaultValue: "PDF",
      },
      pdfUrl: { type: DataTypes.STRING, allowNull: true },
      free: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      tags: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    },
    { tableName: "question_banks", timestamps: true }
  );

  return QuestionBank;
};
