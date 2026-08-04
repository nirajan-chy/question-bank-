const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CommunityMessage = sequelize.define(
    "CommunityMessage",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      communityId: { type: DataTypes.STRING, allowNull: false },
      channelId: { type: DataTypes.STRING, allowNull: false },
      author: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, allowNull: false, defaultValue: "Student" },
      avatar: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
      content: { type: DataTypes.TEXT, allowNull: false },
      reactions: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      attachment: { type: DataTypes.JSONB, allowNull: true },
    },
    { tableName: "community_messages", timestamps: true }
  );

  return CommunityMessage;
};
