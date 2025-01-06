const express = require("express");

const router = express.Router();
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

// Fait le lien entre le controlleur et ce fichier
const booksCtrl = require("../controllers/books");

router.post("/", auth, multer, booksCtrl.createBook); // erreur si multer
router.put("/:id", auth, multer, booksCtrl.modifyBook);
router.delete("/:id", auth, booksCtrl.deleteBook);
router.get("/bestrating", booksCtrl.getBestRating);
router.get("/:id", booksCtrl.getOneBook);
router.get("/", booksCtrl.getAllBooks);
router.post("/:id/rating", auth, booksCtrl.addRating)

module.exports = router;
 