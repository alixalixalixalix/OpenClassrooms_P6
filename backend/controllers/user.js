const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

exports.signup = (req, res, next) => {

  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "L'adresse email n'est pas valide." });
  }

  if (password.length < 5) {
    return res.status(400).json({ message: "Le mot de passe ne peut pas faire moins de 5 caractères." });
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      // Création d'un nouvel objet User
      const user = new User({ 
        email: email,
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
