const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const port = 3031;
const articleDB = require("./models").article;

app.listen(port, () => {
  console.log("Server running on " + port);
});

app.get("/test", (req, res) => {
  res.status(200).send("caca");
});

const connection = require("./models").connection;

app.get("/reset", (req, res) => {
  connection
    .sync({
      force: true,
    })
    .then(() => {
      res.status(200).send({
        message: "Database reset",
      });
    })
    .catch(() => {
      res.status(500).send({
        message: "Server error",
      });
    });
});

app.post("/addArt", async (req, res) => {
  const article = {
    title: req.body.title,
    author: req.body.author,
    bodyText: req.body.bodyText,
    org: req.body.org,
  };

  await articleDB
    .create(article)
    .then(() => {
      res.status(200).send("Article added!");
    })
    .catch((err) => {
      res.status(500).send("Server error");
    });
});

app.get("/getArt/:id", async (req, res) => {
  await articleDB
    .findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((articleFound) => {
      res.status(200).send(articleFound);
    });
});

app.use("/", express.static("./views/form"));
