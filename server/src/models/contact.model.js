const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Contact = sequelize.define(
    "Contact",
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      subject: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
      message: { type: DataTypes.TEXT, allowNull: false },
    },
    { tableName: "contacts", timestamps: true }
  );

  return Contact;
};
