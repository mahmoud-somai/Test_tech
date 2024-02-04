// Importation de la bibliothèque Axios pour les requêtes HTTP
import axios from "axios";

// URL de base de l'API
const url = 'http://localhost:5000/api';

// Classe définissant les services liés aux tâches
class TaskService {
  // Méthode pour ajouter une nouvelle tâche
  AddTask(Task) {
    // Envoi d'une requête POST à l'endpoint /NewTask de l'API avec les données de la tâche
    return axios.post(url + "/NewTask", Task);
  }

  // Méthode pour obtenir une tâche par son ID
  getTaskById(id) {
    // Envoi d'une requête GET à l'endpoint /GetById/{id} de l'API
    return axios.get(url + "/GetById/" + id);
  }

  // Méthode pour supprimer une tâche par son ID
  deleteTask(id) {
    // Envoi d'une requête DELETE à l'endpoint /DeleteTask/{id} de l'API
    return axios.delete(url + "/DeleteTask/" + id);
  }

  // Méthode pour obtenir toutes les tâches
  getAllTasks() {
    // Envoi d'une requête GET à l'endpoint /AllTasks de l'API
    return axios.get(url + "/AllTasks");
  }

  // Méthode pour obtenir les tâches par statut
  getTaskByStatut(statut) {
    // Envoi d'une requête GET à l'endpoint /GetByStatut/{statut} de l'API
    return axios.get(url + "/GetByStatut/" + statut);
  }

  // Méthode pour obtenir les tâches par date
  getTaskByDate(date) {
    // Envoi d'une requête GET à l'endpoint /GetByDate/{date} de l'API
    return axios.get(url + "/GetByDate/" + date);
  }

  // Méthode pour obtenir les tâches par mot-clé
  getTaskByKeyword(keyword) {
    // Envoi d'une requête GET à l'endpoint /search/{keyword} de l'API
    return axios.get(url + "/search/" + keyword);
  }

  // Méthode pour mettre à jour une tâche par son ID
  UpdateTask(id, Task) {
    // Envoi d'une requête PATCH à l'endpoint /UpdateTask/{id} de l'API avec les données de la tâche
    return axios.patch(url + "/UpdateTask/" + id, Task);
  }

  // Méthode pour la connexion d'un utilisateur
  login(user) {
    // Envoi d'une requête POST à l'endpoint /login de l'API avec les données de l'utilisateur
    return axios.post(url + "/login", user);
  }

  // Méthode pour l'inscription d'un nouvel utilisateur
  register(user) {
    // Envoi d'une requête POST à l'endpoint /register de l'API avec les données de l'utilisateur
    return axios.post(url + "/register", user);
  }
}

// Exportation d'une instance unique de la classe TaskService
// eslint-disable-next-line import/no-anonymous-default-export
export default new TaskService();
