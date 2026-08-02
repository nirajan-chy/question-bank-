const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Notice = sequelize.define(
    "Notice",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      title: { type: DataTypes.STRING, allowNull: false },
      category: { type: DataTypes.STRING, allowNull: false },
      date: { type: DataTypes.DATEONLY, allowNull: false },
      body: { type: DataTypes.TEXT, allowNull: false },
      pinned: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      tags: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    },
    { tableName: "notices", timestamps: true }
  );

  return Notice;
};
