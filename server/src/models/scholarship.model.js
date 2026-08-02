const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Scholarship = sequelize.define(
    "Scholarship",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      title: { type: DataTypes.STRING, allowNull: false },
      provider: { type: DataTypes.STRING, allowNull: false },
      level: { type: DataTypes.STRING, allowNull: false },
      amount: { type: DataTypes.STRING, allowNull: false },
      deadline: { type: DataTypes.DATEONLY, allowNull: false },
      seats: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      eligibility: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      requirements: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      category: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      gradient: { type: DataTypes.STRING, allowNull: false },
      featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      tags: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    },
    { tableName: "scholarships", timestamps: true }
  );

  return Scholarship;
};
