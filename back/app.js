// Import des dépendances nécessaires
const express = require('express');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const TaskRoute = require("./routes/task.js");
const UserRoute = require("./routes/user.js");
const app = express();

// Middleware pour gérer les requêtes Entre le front et le back
app.use(cors());

dotenv.config(); // Configuration des variables d'environnement

app.use(express.json()); // Middleware pour permettre la gestion des données JSON dans les requêtes

app.use("/api", TaskRoute); // Utilisation du routeur pour les routes liées aux tâches
app.use("/api", UserRoute); // Utilisation du routeur pour les routes liées aux utilisateurs

// Connexion à la base de données MongoDB
const connect = async () => {
    try {
        await mongoose.connect(process.env.db);
        console.log("Connecté à la base de données avec succès !!! ");
    } catch (error) {
        console.log(error);
        process.exit(1); // En cas d'échec, terminer le processus
    }
};

app.listen(5000, () => {
    connect(); // Appel de la fonction de connexion à la base de données
    console.log("Connecté avec succès au serveur backend");
});

module.exports = app; // Exporter l'application pour les tests ou d'autres utilisations
