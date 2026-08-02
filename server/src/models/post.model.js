const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Post = sequelize.define(
    "Post",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      title: { type: DataTypes.STRING, allowNull: false },
      excerpt: { type: DataTypes.TEXT, allowNull: false },
      category: { type: DataTypes.STRING, allowNull: false },
      author: { type: DataTypes.STRING, allowNull: false },
      authorRole: { type: DataTypes.STRING, allowNull: false },
      cover: { type: DataTypes.STRING, allowNull: false },
      publishedAt: { type: DataTypes.DATEONLY, allowNull: false },
      readingTime: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      likes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      tags: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      body: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
    },
    { tableName: "posts", timestamps: true }
  );

  return Post;
};
