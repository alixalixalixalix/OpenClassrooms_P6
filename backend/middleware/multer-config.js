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