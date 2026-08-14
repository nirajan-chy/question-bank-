const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Community = sequelize.define(
    "Community",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
      icon: { type: DataTypes.STRING, allowNull: false, defaultValue: "Hash" },
      memberCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      badge: { type: DataTypes.STRING, allowNull: true },
      channels: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    { tableName: "communities", timestamps: true }
  );

  return Community;
};
