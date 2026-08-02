const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Subject = sequelize.define(
    "Subject",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      name: { type: DataTypes.STRING, allowNull: false },
      level: { type: DataTypes.STRING, allowNull: false },
      levelSlug: { type: DataTypes.STRING, allowNull: false },
      category: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      overview: { type: DataTypes.TEXT, allowNull: false },
      units: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      syllabus: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      emoji: { type: DataTypes.STRING, allowNull: false },
      gradient: { type: DataTypes.STRING, allowNull: false },
      popularity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      notes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      books: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      questionBanks: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      pastPapers: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      mcqs: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      assignments: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      videos: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      downloads: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      trending: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      relatedSlugs: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      tags: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    },
    { tableName: "subjects", timestamps: true }
  );

  return Subject;
};
