const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports = (req, res, next) => {
  // Vérifie si un fichier a été uploadé
  if (!req.file) {
    return next();
  }

  const inputPath = req.file.path; // Chemin de l'image uploadée
  const outputPath = path.join( // Ajout de "opti_" dans le nom de l'img
    path.dirname(inputPath),
    `opti_${req.file.filename}`
  ); 

  sharp(inputPath)
    .resize({ height: 500 })
    .webp({ quality: 80 })
    .toFile(outputPath)
    .then(() => {
      // Supprime l'image originale
      fs.unlink(inputPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Failed to delete original image:", unlinkErr);
        }
      });

      // Met à jour les informations du fichier
      req.file.path = outputPath;
      req.file.filename = `opti_${req.file.filename}`;

      next();
    })
    .catch((err) => {
      console.error("Image optimization failed:", err);
      res.status(500).json({ error: "Image optimization failed" });
    });
};
