const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CommunityQuestion = sequelize.define(
    "CommunityQuestion",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      title: { type: DataTypes.STRING, allowNull: false },
      body: { type: DataTypes.TEXT, allowNull: false },
      author: { type: DataTypes.STRING, allowNull: false },
      authorRole: { type: DataTypes.STRING, allowNull: false, defaultValue: "Student" },
      avatar: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
      tags: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      votes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      answers: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      answerCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      viewsFormatted: { type: DataTypes.STRING, allowNull: false, defaultValue: "0" },
      answered: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      acceptedAnswerId: { type: DataTypes.STRING, allowNull: true },
      createdAt: { type: DataTypes.DATEONLY, allowNull: false },
      bounty: { type: DataTypes.INTEGER, allowNull: true },
    },
    { tableName: "community_questions", timestamps: true }
  );

  return CommunityQuestion;
};
