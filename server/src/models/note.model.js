const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Note = sequelize.define(
    "Note",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      title: { type: DataTypes.STRING, allowNull: false },
      subjectSlug: { type: DataTypes.STRING, allowNull: false },
      subjectName: { type: DataTypes.STRING, allowNull: false },
      level: { type: DataTypes.STRING, allowNull: false },
      author: { type: DataTypes.STRING, allowNull: false },
      authorRole: { type: DataTypes.STRING, allowNull: false },
      publishedAt: { type: DataTypes.DATEONLY, allowNull: false },
      updatedAt: { type: DataTypes.DATEONLY, allowNull: false },
      unit: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: false },
      pages: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      downloads: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      free: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      pdfUrl: { type: DataTypes.STRING, allowNull: true },
      tags: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    },
    { tableName: "notes", timestamps: true }
  );

  return Note;
};
