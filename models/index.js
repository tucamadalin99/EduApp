const db = require("../config/db");
const article = db.import("./article");
const admin = db.import("./admin");

module.exports = {
  connection: db,
  article,
  admin,
};
