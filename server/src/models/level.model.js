const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Level = sequelize.define(
    "Level",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      name: { type: DataTypes.STRING, allowNull: false },
      short: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      icon: { type: DataTypes.STRING, allowNull: false },
      gradient: { type: DataTypes.STRING, allowNull: false },
      color: { type: DataTypes.STRING, allowNull: false },
      badge: { type: DataTypes.STRING, allowNull: true },
      subjects: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    },
    { tableName: "levels", timestamps: true }
  );

  return Level;
};
