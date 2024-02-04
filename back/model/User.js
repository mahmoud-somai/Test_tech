// Import de la bibliothèque mongoose pour la modélisation des schémas
const mongoose = require("mongoose");

// Définition du schéma de l'utilisateur
const UserSchema = new mongoose.Schema({
    // Champ email de type chaîne de caractères
    email: {
        type: String,
    },
    // Champ password de type chaîne de caractères
    password: {
        type: String,
    }
});

// Création du modèle User à partir du schéma UserSchema
module.exports = mongoose.model("User", UserSchema);
