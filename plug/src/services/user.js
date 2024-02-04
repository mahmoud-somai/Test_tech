// Importation de la bibliothèque Axios pour les requêtes HTTP
import axios from "axios";

// URL de base de l'API
const url = 'http://localhost:5000/api';

// Classe définissant les services liés à l'utilisateur
class UserService {
  // Méthode pour la connexion d'un utilisateur
  login(user) {
    // Envoi d'une requête POST à l'endpoint /login de l'API avec les données de l'utilisateur
    return axios.post(url + "/login", user);
  }

  // Méthode pour l'inscription d'un nouvel utilisateur
  register(user) {
    // Envoi d'une requête POST à l'endpoint /newuser de l'API avec les données de l'utilisateur
    return axios.post(url + "/newuser", user);
  }
}

// Exportation d'une instance unique de la classe UserService
// eslint-disable-next-line import/no-anonymous-default-export
export default new UserService();
