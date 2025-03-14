const Book = require("../models/Book");
const fs = require("fs"); // Module permet de lire, écrire, ou suppr des fichiers
const optimizeImg = require("../middleware/optimize-img");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book); // Depuis ajout de multer, on doit parser
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({ // Création d'un nouvel objet Book
    ...bookObject, // Récupère l'ensemble des champs
    userId: req.auth.userId,

    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename // Création d'une URL d'image
    }`,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Objet enregistré" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé !" }))
            .catch((error) => res.status(400).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }) // Compare les éléments entre ({}) et si =, exécute
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.addRating = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Vérifie si le livre existe
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé." });
      }

      // Nouvelle note
      book.ratings.push({ userId: req.auth.userId, grade: req.body.rating });

      // Moyenne
      const totalGrades = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
      book.averageRating = totalGrades / book.ratings.length;

      // Save les infos
      return book.save().then(() => {
        res.status(201).json(book);
      });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};