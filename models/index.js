const db = require("../config/db");
const article = db.import("./article");

module.exports = {
  connection: db,
  article,
};
