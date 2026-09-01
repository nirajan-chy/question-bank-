const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MockTest = sequelize.define(
    "MockTest",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      title: { type: DataTypes.STRING, allowNull: false },
      subjectSlug: { type: DataTypes.STRING, allowNull: false },
      subjectName: { type: DataTypes.STRING, allowNull: false },
      level: { type: DataTypes.STRING, allowNull: false },
      questions: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      questionData: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      durationMinutes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      fullMarks: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      attempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      avgScore: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      difficulty: {
        type: DataTypes.ENUM("Easy", "Medium", "Hard"),
        allowNull: false,
        defaultValue: "Medium",
      },
      description: { type: DataTypes.TEXT, allowNull: false },
      premium: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      tags: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    },
    { tableName: "mock_tests", timestamps: true }
  );

  return MockTest;
};
