const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const LeaderboardEntry = sequelize.define(
    "LeaderboardEntry",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      level: { type: DataTypes.STRING, allowNull: false },
      streak: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      xp: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      rank: { type: DataTypes.INTEGER, allowNull: false },
      avatar: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: "leaderboard", timestamps: true }
  );

  return LeaderboardEntry;
};
