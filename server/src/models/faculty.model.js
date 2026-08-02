const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Faculty = sequelize.define(
    "Faculty",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      name: { type: DataTypes.STRING, allowNull: false },
      short: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      icon: { type: DataTypes.STRING, allowNull: false },
      gradient: { type: DataTypes.STRING, allowNull: false },
      programs: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    },
    { tableName: "faculties", timestamps: true }
  );

  return Faculty;
};
