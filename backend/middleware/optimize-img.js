const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports = (req, res, next) => {
  // Vérifie si un fichier a été uploadé
  if (!req.file) {
    return next(); // Passe au middleware suivant si aucun fichier n'est fourni
  }

  const inputPath = req.file.path; // Chemin de l'image uploadée
  const outputPath = path.join(
    path.dirname(inputPath),
    `opti_${req.file.filename}`
  );

  // Optimise l'image
  sharp(inputPath)
    .resize({ height: 500 }) // Redimensionne la hauteur tout en respectant le ratio
    .webp({ quality: 80 }) // Convertit en WebP avec une qualité de 50
    .toFile(outputPath)
    .then(() => {
      // Supprime l'image originale après optimisation
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
