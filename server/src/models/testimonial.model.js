const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Testimonial = sequelize.define(
    "Testimonial",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, allowNull: false },
      level: { type: DataTypes.STRING, allowNull: false },
      avatar: { type: DataTypes.STRING, allowNull: false },
      quote: { type: DataTypes.TEXT, allowNull: false },
      rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      achievement: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: "testimonials", timestamps: true }
  );

  return Testimonial;
};
