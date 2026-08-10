const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Course = sequelize.define(
    "Course",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      name: { type: DataTypes.STRING, allowNull: false },
      short: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      levelSlug: { type: DataTypes.STRING, allowNull: false },
      category: { type: DataTypes.STRING, allowNull: false },
      icon: { type: DataTypes.STRING, allowNull: false },
      gradient: { type: DataTypes.STRING, allowNull: false },
      semesterCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 8 },
      university: { type: DataTypes.STRING, allowNull: false, defaultValue: "TU" },
      tags: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    },
    { tableName: "courses", timestamps: true }
  );

  return Course;
};