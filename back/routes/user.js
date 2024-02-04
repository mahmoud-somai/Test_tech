// Import des dépendances nécessaires
const User = require("../model/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// Fonction pour créer un nouvel utilisateur
const createUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Normalisation de l'email en minuscules
        const normalizedEmail = email.toLowerCase();

        // Vérification de l'existence de l'email dans la base de données
        const emailExist = await User.findOne({ email: normalizedEmail });
        if (emailExist) {
            return res.status(400).send("Existing User !!!");
        }

        // Hachage du mot de passe
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Création d'un nouvel utilisateur avec email normalisé et mot de passe haché
        const newUser = new User({
            email: normalizedEmail,
            password: hash,
        });

        // Enregistrement du nouvel utilisateur dans la base de données
        await newUser.save();
        res.status(200).send("User inserted With Success !!!");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

// Fonction pour gérer la connexion de l'utilisateur
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Recherche de l'utilisateur dans la base de données
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid Email");
        }

        // Vérification du mot de passe
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).send("Wrong password");
        }

        // Création d'un jeton d'authentification
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

        // Envoi du jeton et de l'ID de l'utilisateur dans la réponse
        res.header("Authorization", token).json({
            token,
            id: user._id,
            email: user.email
            
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

// Définition des routes
router.post("/newuser", createUser); // Endpoint pour créer un nouvel utilisateur
router.post("/login", loginUser);    // Endpoint pour gérer la connexion d'un utilisateur

// Export du routeur
module.exports = router;
