const express = require("express");
const cors = require("cors");

// Créé un application express
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const dotenv = require('dotenv').config();

// Fait le lien avec ce fichier
const booksRoutes = require("./routes/books");
const userRoutes = require("./routes/user");

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Permet de transformer tout le json en objet javascript
app.use(express.json());
app.use(cors());

// Permet de donner l'autorisation à tlm d'utiliser l'API
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

app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

// Permet d'accéder à app depuis les autres fichiers
module.exports = app;


 