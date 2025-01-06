const multer = require("multer");

// Défini les extensions des fichiers reçus
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png"
};

const storage = multer.diskStorage({
  // Indique dans quel dossier enregistrer les fichiers
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // Renomme le fichier reçu
  filename: (req, file, callback) => {
    // Remplace les espaces par des underscores
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    // Ajout d'une date au fichier pour rendre le nom unique
    callback(null, name + Date.now() + "." + extension);
  }
});

module.exports = multer({ storage }).single("image");

/*
const sharp = require("sharp")
await sharp('picture.jpg')
  .resize(2000) // Ajuste la longueur  
*/

/*
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.static("./uploads"));

app.get("/", (req, res) => {
  return res.json({ message: "Hello world" });
});

app.post("/", upload.single("picture"), async (req, res) => {
  fs.access("./uploads", (error) => {
    if (error) {
      fs.mkdirSync("./uploads");
    }
  });
  const { buffer, originalname } = req.file;
  const timestamp = new Date().toISOString();
  const ref = `${timestamp}-${originalname}.webp`;
  await sharp(buffer)
    .webp({ quality: 20 })
    .toFile("./uploads/" + ref);
  const link = `http://localhost:3000/${ref}`;
  return res.json({ link });
});

app.listen(3000);
*/