const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Faq = sequelize.define(
    "Faq",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      question: { type: DataTypes.TEXT, allowNull: false },
      answer: { type: DataTypes.TEXT, allowNull: false },
      category: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: "faqs", timestamps: true }
  );

  return Faq;
};
