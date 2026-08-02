const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ResultEntry = sequelize.define(
    "ResultEntry",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      exam: { type: DataTypes.STRING, allowNull: false },
      level: { type: DataTypes.STRING, allowNull: false },
      board: { type: DataTypes.STRING, allowNull: false },
      year: { type: DataTypes.INTEGER, allowNull: false },
      publishedAt: { type: DataTypes.DATEONLY, allowNull: false },
      totalCandidates: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      passed: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      passRate: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      url: { type: DataTypes.STRING, allowNull: false },
      notable: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    },
    { tableName: "results", timestamps: true }
  );

  return ResultEntry;
};
