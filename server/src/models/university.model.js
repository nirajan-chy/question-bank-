const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const University = sequelize.define(
    "University",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      name: { type: DataTypes.STRING, allowNull: false },
      short: { type: DataTypes.STRING, allowNull: false },
      established: { type: DataTypes.INTEGER, allowNull: false },
      location: { type: DataTypes.STRING, allowNull: false },
      type: {
        type: DataTypes.ENUM("Constituent", "Affiliated", "Autonomous"),
        allowNull: false,
      },
      description: { type: DataTypes.TEXT, allowNull: false },
      programs: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      ranking: { type: DataTypes.STRING, allowNull: false },
      students: { type: DataTypes.INTEGER, allowNull: false },
      website: { type: DataTypes.STRING, allowNull: false },
      gradient: { type: DataTypes.STRING, allowNull: false },
    },
    { tableName: "universities", timestamps: true }
  );

  return University;
};
