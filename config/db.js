const Sequelize = require("sequelize");

const sequelize = new Sequelize("Article", "root", "", {
  dialect: "mysql",
  host: "localhost",
  define: {
    timestamps: true,
  },
});

module.exports = sequelize;

//Standard Database config for the server
//
