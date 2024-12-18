const express = require("express");
const app = express();

const mongoose = require('mongoose');
mongoose
  .connect(
    "mongodb+srv://izumi:shinichi@cluster0.ar8rw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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

app.post("/api/books", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: 'Objet créé'
  })
});

app.get("/api/books", (req, res, next) => {
  const stuff = [
    {
      _id: "oeihfzeoi",
      title: "L'hôtel des oiseaux",
      author: "Joyce Maynard",
      year: "2023",
      imageUrl:
        "https://lh4.googleusercontent.com/proxy/cI3PqJ_FiZdYeoY0UQ0fu18FlO47NLJ3suaLQyvABCWbdtqpsQuCMfIPUXLq_wvJhSArLo0IAATp-nCl7bbSyj8EY4FmCI-Z",
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

module.exports = app;
