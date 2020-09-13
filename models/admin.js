module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      "admin",
      {
        nume: DataTypes.STRING,
        prenume:DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,  
         
      },
      {
        timestamps: true,
        underscored: true,
        tableName: "admin",
      }
    );
  };
  