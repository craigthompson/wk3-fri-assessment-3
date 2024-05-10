import express from "express";
import session from "express-session";
import lodash from "lodash";
import morgan from "morgan";
import nunjucks from "nunjucks";
import ViteExpress from "vite-express";
import bodyParser from "body-parser";

const app = express();
const port = "8000";

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(
  session({ secret: "ssshhhhh", saveUninitialized: true, resave: false })
);
app.use(bodyParser.json());

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

////////////////////////////////////////////////
//  Data Objects
////////////////////////////////////////////////

const MOST_LIKED_FOSSILS = {
  aust: {
    img: "/img/australopith.png",
    name: "Australopithecus",
    num_likes: 584,
  },
  quetz: {
    img: "/img/quetzal_torso.png",
    name: "Quetzal",
    num_likes: 587,
  },
  steg: {
    img: "/img/stego_skull.png",
    name: "Stegosaurus",
    num_likes: 598,
  },
  trex: {
    img: "/img/trex_skull.png",
    name: "Tyrannosaurus Rex",
    num_likes: 601,
  },
};

const OTHER_FOSSILS = [
  {
    img: "/img/ammonite.png",
    name: "Ammonite",
  },
  {
    img: "/img/mammoth_skull.png",
    name: "Mammoth",
  },
  {
    img: "/img/ophthalmo_skull.png",
    name: "Opthalmosaurus",
  },
  {
    img: "/img/tricera_skull.png",
    name: "Triceratops",
  },
];

////////////////////////////////////////////////
//  Routes
////////////////////////////////////////////////
app.get("/", (req, res) => {
  if (req.session.username) {
    res.redirect("/top-fossils");
  } else {
    res.render("homepage.html");
  }
});

app.get("/get-name", (req, res) => {
  const sessionObj = req.session;
  sessionObj.username = req.query.name;
  res.redirect("/top-fossils");
});

app.get("/top-fossils", (req, res) => {
  if (req.session.username) {
    res.render("top-fossils.html", {
      fossils: MOST_LIKED_FOSSILS,
      name: req.session.username,
    });
  } else {
    res.redirect("/");
  }
});

app.post("/like-fossil", (req, res) => {
  MOST_LIKED_FOSSILS[req.body["fossil-select"]].num_likes += 1;
  res.render("thank-you.html", { name: req.session.username });
});

app.post("/random-fossil.json", (req, res) => {
  // Callback function gets a random fossil that isn't the currently passed fossil in the request.
  let randomFossil = lodash.sample(OTHER_FOSSILS);
  while (randomFossil.name === req.body.currentFossilName) {
    randomFossil = lodash.sample(OTHER_FOSSILS);
  }
  res.json(randomFossil);
});

ViteExpress.listen(app, port, () => {
  console.log(`Server running on http://localhost:${port}...`);
});
