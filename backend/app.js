const express = require("express");
const app = express();
const mongoose = require("mongoose");

const booksRoutes = require("./routes/books");
const userRoutes = require("./routes/user");

mongoose
  .connect(
    "mongodb+srv://alixbocquier:ouinouin@cluster0.osykl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

/*
app.get("/api/books", (req, res, next) => {
  const stuff = [
    {
      _id: "oeihfzeoi",
      title: "L'hôtel des oiseaux",
      author: "Joyce Maynard",
      year: "2023",
      imageUrl:
        "https://m.media-amazon.com/images/I/81RBlQzAE0L._UF1000,1000_QL80_.jpg",
      genre: "Roman",
    },
    {
      _id: "oeihfzeomoihi",
      title: "Un chien de saison",
      author: "Maurice Denuzière",
      year: "1979",
      imageUrl: "https://m.media-amazon.com/images/I/71DXHRXuZgL.jpg",
      genre: "Roman humoristique",
    },
    {
      _id: "oeihfzeomoihi",
      title: "Hygiène de l'assassin",
      author: "Amélie Nothomb",
      year: "1992",
      imageUrl:
        "https://m.media-amazon.com/images/I/71rHMBlU1RL._AC_UF894,1000_QL80_.jpg",
      genre: "Roman",
    },
  ];
  res.status(200).json(stuff);
});
*/

app.use("api/books", booksRoutes);
app.use("api/auth", userRoutes);

module.exports = app;


