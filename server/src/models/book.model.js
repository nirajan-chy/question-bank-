const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Book = sequelize.define(
    "Book",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      title: { type: DataTypes.STRING, allowNull: false },
      author: { type: DataTypes.STRING, allowNull: false },
      publisher: { type: DataTypes.STRING, allowNull: false },
      edition: { type: DataTypes.STRING, allowNull: false },
      level: { type: DataTypes.STRING, allowNull: false },
      language: {
        type: DataTypes.ENUM("English", "Nepali", "Bilingual"),
        allowNull: false,
        defaultValue: "English",
      },
      isbn: { type: DataTypes.STRING, allowNull: false },
      pages: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      price: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      reviews: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      cover: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      subjects: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      tags: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      bestseller: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { tableName: "books", timestamps: true }
  );

  return Book;
};
