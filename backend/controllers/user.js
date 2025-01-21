const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) // Crypte un mdp
    .then((hash) => {
      // Création d'un nouvel objet User
      const user = new User({ 
        email: req.body.email,
        password: hash,
      });
      user
        .save() // Save User en bdd
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Email ou mot de passe incorrect !" });
      }
      bcrypt
        .compare(req.body.password, user.password) // Compare le mdp renseigné et celui en bdd 
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Email ou mot de passe incorrect" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
