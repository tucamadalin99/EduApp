const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const port = 3031;
const articleDB = require("./models").article;
const adminDB =  require("./models").admin;
const initPassport = require("./config/passport-config");
const session = require("express-session");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");
const { userInfo } = require("os");
const passport = require("passport");

const corsOptions = {
  origin: true,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Methods",
    "Access-Control-Request-Headers",
  ],
  credentials: true,
  enablePreflight: true,
};


initPassport(
  passport,
  async (email) => {
    return await adminDB.findOne({ where: { email: email } });
  },
  async (id) => {
    return await adminDB.findOne({ where: { id: id } });
  }
);

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,DELETE,PUT,POST");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});



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
app.post("/register", async (req, res) => {
  const errors = [];

  const admin = {
    nume: req.body.nume,
    prenume: req.body.prenume,
    email: req.body.email,
    password: req.body.password,
   
  }


  if (!errors.length) {
    try {
      const hashpass = await bcrypt.hash(admin.password,10);
      admin.password = hashpass;
      await adminDB.create(admin)
      res.status(201).send({
        message: 'Admin adugat'
      })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: 'Eroare la inregistrarea unu admin'
      })
    }
  } else {
    res.status(400).send({
      errors
    })
  }
});

app.get("/success", async (req, res) => {
   res.status(200).send({ message: "You logged in!" });
});

app.get("/fail", async (req, res) => {
  res
    .status(401)
    .send({ message: "Email & Password combination does not match." });
});

app.get("/notAuth", async (req, res) => {
  res
    .status(401)
    .send({ message: "You must authenticate to access this route." });
});

app.get("/alreadyAuth", async (req, res) => {
  res.status(401).send({ message: "You are already authenticated." });
});

app.get("/userData", checkNotAuth, async (req, res) => {
  res.status(200).send({ message: "Important stuff." });
});

app.get("/logout", async (req, res) => {
  res.status(200).send({ message: "You logged out!" });
});

function checkNotAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/api/notAuth");
}

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/api/alreadyAuth");
  }
  return next();
}

app.post(
  "/login",
  checkAuth,
  passport.authenticate("local", {
    successRedirect: "/success",
    failureRedirect: "/fail",
  })
);

app.delete("/logout", async (req, res) => {
  req.logOut();
  res.redirect("/logout");
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
