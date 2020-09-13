module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "article",
    {
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      bodyText: DataTypes.STRING,
      org: DataTypes.STRING,
      project: DataTypes.STRING,
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "articles",
    }
  );
};
