// Import de la bibliothèque mongoose pour la modélisation des schémas
const mongoose = require("mongoose");

// Définition du schéma pour la collection 'tasks'
const TaskSchema = new mongoose.Schema({
    id_user: {
        type: String, // Champ pour stocker l'ID de l'utilisateur associé à la tâche
    },
    Titre: {
        type: String,
        required: true, // Le titre de la tâche est requis
    },
    Description: {
        type: String,
        required: true, // La description de la tâche est requise
    },
    DateEcheance: {
        type: Date,
        default: Date.now, // La date d'échéance par défaut est la date actuelle
    },
    Statut: {
        type: String,
        enum: ['done', 'not done', 'en cours'], // Le statut doit être l'un des trois : 'done', 'not done' ou 'en cours'
        default: 'en cours', // La valeur par défaut est 'en cours'
    }
});

// Exportation du modèle mongoose basé sur le schéma
module.exports = mongoose.model("Task", TaskSchema);
