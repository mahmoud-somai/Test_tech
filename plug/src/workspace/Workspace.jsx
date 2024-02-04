// Importation des modules React et des icônes
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Workspace.css';
import { PiNotePencil } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { GrFormNextLink } from "react-icons/gr";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { ImCancelCircle } from "react-icons/im";
import { RxUpdate } from "react-icons/rx";

// Importation du service TaskService pour interagir avec l'API
import TaskService from '../services/task';



const Workspace = () => {

// Déclaration d'un état tasks, qui sera utilisé pour stocker la liste des tâches.
const [tasks, setTasks] = useState([]);

// Déclaration d'un état nouvelle tache , qui sera utilisé pour stocker les détails d'une nouvelle tâche à ajouter.
const [newTask, setNewTask] = useState({ Titre: '', Description: '',});

// Déclaration d'un état selectedTask, qui sera utilisé pour stocker la tâche actuellement sélectionnée.
const [selectedTask, setSelectedTask] = useState(null);

// Déclaration d'un état updatedTask, qui sera utilisé pour stocker les détails mis à jour d'une tâche.
const [updatedTask, setUpdatedTask] = useState({ Titre: '', Description: ''});

// Déclaration d'un état filterDate, qui sera utilisé pour filtrer les tâches en fonction d'une date spécifique.
const [filterDate, setFilterDate] = useState(null);

// Déclaration d'un état searchTerm, qui sera utilisé pour filtrer les tâches en fonction d'un terme de recherche.
const [searchTerm, setSearchTerm] = useState('');

// Déclaration d'un état keywordTerm, qui sera utilisé pour filtrer les tâches en fonction d'un terme clé.
const [keywordTerm, setKeywordTerm] = useState('');

// Déclaration d'un état filteredTasks, qui sera utilisé pour stocker les tâches filtrées en fonction des différents critères.
const [filteredTasks, setFilteredTasks] = useState([]);

// État isOverlayOpen gère l'ouverture/fermeture de l'overlay.
const [isOverlayOpen, setIsOverlayOpen] = useState(false);

// Référence useRef utilisée pour déterminer si un clic a été effectué en dehors de l'overlay.
const overlayRef = useRef(null);

  
/* Utilisation de useEffect pour effectuer une action chaque fois que filterDate change.*/

useEffect(() => {
  // Fonction asynchrone fetchData pour récupérer les tâches en fonction de la date filtrée.
  const fetchData = async () => {
    try {
      // Vérifie s'il y a une date de filtrage sélectionnée.
      if (filterDate) {
        // Appelle le service getTaskByDate avec la date sélectionnée.
        const response = await TaskService.getTaskByDate(filterDate);
        // Met à jour l'état filteredTasks avec les données de la réponse.
        setFilteredTasks(response.data);
      } else {
        // Si aucune date n'est sélectionnée, affiche toutes les tâches.
        setFilteredTasks(tasks);
      }
    } catch (error) {
      // En cas d'erreur lors de la récupération des tâches par date, affiche une erreur dans la console.
      console.error('Error fetching tasks by date:', error);
      // Gère l'erreur de manière appropriée.
    }
  };

  // Appelle la fonction fetchData au montage du composant ou lorsque filterDate change.
  fetchData();
}, [filterDate]);

// Utilisation de useEffect pour filtrer les tâches en fonction du terme de recherche.
useEffect(() => {
  // Filtrer les tâches en fonction du terme de recherche, insensible à la casse.
  const filteredTasksBySearch = tasks.filter((task) =>
    task.Titre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Met à jour l'état filteredTasks avec les tâches filtrées.
  setFilteredTasks(filteredTasksBySearch);
}, [searchTerm, tasks]);


  
/* Fonction handleIconUpdateClick appelée lors du clic sur l'icône de mise à jour.*/
const handleIconUpdateClick = (task) => {
  // Sélectionne la tâche à mettre à jour.
  setSelectedTask(task);
  // Initialise les champs mis à jour avec les détails de la tâche sélectionnée.
  setUpdatedTask({
    Titre: task.Titre,
    Description: task.Description,
  });
  // Ouvre l'overlay pour la mise à jour de la tâche.
  setIsOverlayOpen(true);
};

/* Utilisation de useEffect pour récupérer toutes les tâches au chargement initial du composant.*/
useEffect(() => {
  const fetchAllTasks = async () => {
    try {
      // Appelle le service getAllTasks pour obtenir toutes les tâches.
      const tasksData = await TaskService.getAllTasks();
      // Met à jour l'état tasks avec les données des tâches obtenues.
      setTasks(tasksData.data);
      // Affiche les données des tâches dans la console (peut être retiré en production).
      console.log(tasksData.data);
    } catch (error) {
      // En cas d'erreur lors de la récupération de toutes les tâches, affiche une erreur dans la console.
      console.error('Error fetching all tasks:', error);
    }
  };

  // Appelle la fonction fetchAllTasks au montage du composant (une seule fois).
  fetchAllTasks();
}, []);



// Utilisation de useEffect pour gérer les clics en dehors de l'overlay.
useEffect(() => {
  // Fonction handleOutsideClick vérifie si le clic a été effectué en dehors de l'overlay.
  const handleOutsideClick = (event) => {
    if (overlayRef.current && !overlayRef.current.contains(event.target)) {
      // Ferme l'overlay si le clic est en dehors de celui-ci.
      closeOverlay();
    }
  };

  // Attache l'écouteur d'événements lorsque l'overlay est ouvert.
  if (isOverlayOpen) {
    document.addEventListener('click', handleOutsideClick);
  }

  // Nettoie l'écouteur d'événements lorsque le composant est démonté ou que l'overlay est fermé.
  return () => {
    document.removeEventListener('click', handleOutsideClick);
  };
}, [isOverlayOpen]);

// Fonction handleIconClick appelée lors du clic sur l'icône, sélectionne la tâche et ouvre l'overlay.
const handleIconClick = (task) => {
  setSelectedTask(task);
  setIsOverlayOpen(true);
};

/* Fonction closeOverlay utilisée pour fermer l'overlay, réinitialiser les états et laisser la tâche sélectionnée nulle */
const closeOverlay = () => {
  setIsOverlayOpen(false);
  setSelectedTask(null);
  setUpdatedTask({
    Titre: '',
    Description: '',
  });
};

// Fonction handleInputChange appelée lors de la modification des champs de nouvelle tâche.
const handleInputChange = (e) => {
  // Destructure le nom et la valeur du champ modifié.
  const { name, value } = e.target;
  // Met à jour l'état newTask en conservant les valeurs précédentes et en ajoutant la nouvelle valeur.
  setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
};

// Fonction handleInputUpdateChange appelée lors de la modification des champs de mise à jour de la tâche.
const handleInputUpdateChange = (e) => {
  // Destructure le nom et la valeur du champ modifié.
  const { name, value } = e.target;
  // Met à jour l'état updatedTask en conservant les valeurs précédentes et en ajoutant la nouvelle valeur.
  setUpdatedTask((prevTask) => ({
    ...prevTask,
    [name]: value,
  }));
};

// Fonction handleAddTask appelée lors de l'ajout d'une nouvelle tâche.
const handleAddTask = async () => {
  try {
    // Récupère l'ID de l'utilisateur depuis le stockage local.
    const id_user = localStorage.getItem('id');
    // Appelle le service AddTask pour ajouter une nouvelle tâche avec les détails de newTask.
    await TaskService.AddTask({ id_user, Titre: newTask.Titre, Description: newTask.Description });
    // Recharge la page pour afficher la mise à jour.
    window.location.reload();
    // Ferme l'overlay après l'ajout de la tâche.
    closeOverlay();
  } catch (error) {
    // En cas d'erreur lors de l'ajout de la tâche, affiche une erreur dans la console.
    console.error('Error adding task:', error);
  }
};

// Fonction handleUpdateTask appelée lors de la mise à jour d'une tâche existante.
const handleUpdateTask = async () => {
  if (selectedTask) {
    try {
      // Ajoute la date d'échéance actuelle à la tâche mise à jour.
      const updatedTaskWithDate = {
        ...updatedTask,
        DateEcheance: Date.now(),
      };

      // Appelle le service UpdateTask pour mettre à jour la tâche sélectionnée avec les détails de updatedTaskWithDate.
      await TaskService.UpdateTask(selectedTask._id, updatedTaskWithDate);
      // Recharge la page pour afficher la mise à jour.
      window.location.reload();
    } catch (error) {
      // En cas d'erreur lors de la mise à jour de la tâche, affiche une erreur dans la console.
      console.error('Error updating task:', error);
    } finally {
      // Ferme l'overlay après la mise à jour de la tâche.
      closeOverlay();
    }
  }
};

// Fonction handleDeleteClick appelée lors du clic sur le bouton de suppression de la tâche.
const handleDeleteClick = async () => {
  if (selectedTask) {
    try {
      // Appelle le service deleteTask pour supprimer la tâche sélectionnée.
      await TaskService.deleteTask(selectedTask._id);
      // Recharge la page pour afficher la mise à jour.
      window.location.reload();
      // Ferme l'overlay après la suppression de la tâche.
      closeOverlay();
      // Vous voudrez peut-être mettre à jour votre tableau de tâches ou récupérer la liste mise à jour depuis le serveur.
    } catch (error) {
      // En cas d'erreur lors de la suppression de la tâche, affiche une erreur dans la console.
      console.error('Error deleting task:', error);
      // Gère l'erreur de manière appropriée.
    }
  }
};


const [isLogoutVisible, setLogoutVisible] = useState(false);
const navigate = useNavigate();


// Function to handle user icon click
const handleUserIconClick = () => {
  setLogoutVisible(!isLogoutVisible);
};

// Function to handle logout button click
const handleLogoutClick = () => {
  localStorage.clear();
  navigate('/');
  setLogoutVisible(false);
};

  return (

    <div class="work_container">
{/* Commentaire JSX : Div principale de la barre latérale contenant l'icône d'ajout de tâche et l'indicateur de connexion. */}
<div className="sidebar">
  {/* Icône d'ajout de tâche dans la partie supérieure, déclenchant la fonction handleIconClick lorsqu'elle est cliquée. */}
  <div className="top-icon" onClick={handleIconClick}>
    <IoMdAddCircle className='add_task_icon'/>
  </div>

  {/* Overlay pour l'ajout de nouvelles tâches, affiché conditionnellement si isOverlayOpen est vrai. */}
  {isOverlayOpen && (
    <div className="overlay">
      <div className="overlay-content">
        {/* Contenu de l'overlay pour l'ajout de nouvelles tâches. */}
        <div class="addtask">
          <div class="addtask-content">
            <p class="addtask-heading"><h2>New Task</h2></p>

            {/* Formulaire pour saisir le titre et la description de la nouvelle tâche. */}
            <form class="addtask_container">
              <input placeholder="Titre" class="taskinput" name="Titre" type="text" value={newTask.Titre} onChange={handleInputChange}/>
              <textarea placeholder="Description" class="taskinput2" name="Description" type="text" value={newTask.Description} onChange={handleInputChange}/>
            </form>
          </div>

          {/* Boutons pour annuler l'ajout de la tâche ou la confirmer. */}
          <div class="addtask-button-wrapper">
            <button class="addtask-button " onClick={closeOverlay}>
              ANNULER <ImCancelCircle className='btn_icon'/>
            </button>
            <button class="addtask-button primary" onClick={handleAddTask}>
              AJOUTER <IoMdAddCircle className='btn_icon'/>
            </button>
          </div>
        </div>            
      </div>
    </div>
  )}

  {/* Conteneur d'icônes en bas de la barre latérale, actuellement contenant une icône utilisateur. */}
  <div className="icon-container">
    <FaRegUserCircle className='add_task_icon' onClick={handleUserIconClick} />
    {/* Indicateur de connexion (peut être un point vert ou rouge, selon l'état de connexion). */}
    <div className="connected-indicator"></div>
  </div>
  {isLogoutVisible && (
        <button className="logout-button" onClick={handleLogoutClick}>
          LOGOUT
        </button>
      )}

</div>



  <div class="task_container">
    {/* Barre de navigation avec le titre "Mon espace de travail" */}
      <div className="navbar"><h2>Mon espace de travail</h2></div>

    {/* Barre de recherche avec des champs de recherche, mot-clé et filtre de date */}

<div className="searchbar">
  {/* Groupe d'entrées pour la recherche, mot-clé et filtre de date */}
  <div class="input-group">
    {/* Conteneur pour les champs de recherche et mot-clé */}
    <div className='search-container'>
      {/* Champ de recherche par email */}
      <input
        type="email"
        className="input"
        id="Email"
        name="Email"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* Icône de recherche */}
      <CiSearch className="search-icon" />
      {/* Séparateur visuel */}
      <div className="separator"></div>
      {/* Champ de mot-clé */}
      <input
        className="keyword"
        placeholder="Keyword"
        value={keywordTerm}
        onChange={(e) => setKeywordTerm(e.target.value)}
      />
    </div>

    {/* Conteneur pour le champ de date */}
    <div className="date-input-container">
      {/* Champ de date */}
      <input
        type="date"
        className="date-input"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
      />
      {/* Icône pour effacer la date filtrée */}
      <GrFormNextLink className="icon" onClick={() => setFilterDate(null)} />
      {/* Bouton pour filtrer par la date d'aujourd'hui */}
      <button className="aujourdhui-button" onClick={() => setFilterDate(new Date().toISOString().split('T')[0])}>
        Aujourd'hui
      </button>
    </div>
  </div>
</div>

            

{/* Conteneur principal pour afficher les tâches */}
<div className="tasks">
  {/* Filtrer, trier et mapper chaque tâche */}
  {tasks
    .filter((task) => {
      // Filtrer les tâches par utilisateur (id_user)
      const userIdFromLocalStorage = localStorage.getItem('id');
      if (userIdFromLocalStorage && task.id_user !== userIdFromLocalStorage) {
        return false;
      }

      // Filtrer par date
      if (filterDate) {
        const taskDate = new Date(task.DateEcheance).toISOString().split('T')[0];
        if (taskDate !== filterDate) {
          return false;
        }
      }

      // Filtrer par termes de recherche (titre et description)
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const lowerCaseKeywordTerm = keywordTerm.toLowerCase();
      const titleMatch = task.Titre.toLowerCase().includes(lowerCaseSearchTerm);
      const descriptionMatch = task.Description.toLowerCase().includes(lowerCaseKeywordTerm);

      // Retourner true si le titre ou la description correspond ou si les deux termes de recherche sont vides
      return titleMatch && descriptionMatch && (searchTerm === '' || keywordTerm === '');
    })
    .sort((a, b) => a.Titre.localeCompare(b.Titre))
    .map((task) => (
      // Carte individuelle pour chaque tâche 
      <div key={task._id} class="task_card">
        {/* Conteneur pour la première lettre du titre */}
        <div class="title_container">
          <div class="first_letter">
            {/* Afficher la première lettre du titre en majuscule */}
            <span class="letter">{task.Titre.charAt(0).toUpperCase()}</span>
          </div>
          {/* Conteneur pour le titre complet */}
          <div class="title"> 
            {/* Afficher le titre complet avec un effet de survol pour voir le titre complet */}
            <span class="full_title" title={task.Titre}>{task.Titre}</span>
          </div>
        </div>
        {/* Afficher la description de la tâche */}
        <span class="description_body">
          {task.Description}
        </span>
        {/* Conteneur pour le sélecteur de statut, l'icône de modification et l'overlay de modification */}
        <div className="select_container">
          {/* Sélecteur de statut */}
          <select
            className={`choice ${task.Statut === 'done' ? 'green' : task.Statut === 'en cours' ? 'yellow' : 'red'}`}
            value={task.Statut}
            onChange={async (e) => {
              // Mise à jour uniquement du statut dans l'état
              setUpdatedTask({ ...updatedTask, Statut: e.target.value });

              // Appeler votre service pour mettre à jour uniquement le statut de la tâche immédiatement
              try {
                const updatedStatut = { Statut: e.target.value };
                await TaskService.UpdateTask(task._id, updatedStatut);
                window.location.reload();
                // Vous voudrez peut-être mettre à jour votre tableau de tâches ou récupérer la liste mise à jour depuis le serveur
              } catch (error) {
                console.error('Error updating task:', error);
                // Gérer l'erreur de manière appropriée
              }
            }}
          >
            <option value="en cours">En Cours</option>
            <option value="not done">Not Done</option>
            <option value="done">Done</option>
          </select>

          {/* Icône pour ouvrir l'overlay de modification */}
          <div className="icon_container" onClick={() => handleIconUpdateClick(task)}>
            <PiNotePencil />
          </div>

          {/* Overlay de modification, affiché conditionnellement */}
          {isOverlayOpen && selectedTask && selectedTask._id === task._id && (
            <div className="overlay">
              <div className="overlay-content">
                {/* Contenu de l'overlay pour la modification de la tâche */}
                <div class="addtask">
                  <div class="addtask-content">
                    <p class="addtask-heading"><h2>Modifier Tache</h2></p>
                    {/* Formulaire pour la modification du titre et de la description */}
                    <form class="addtask_container">
                      <input placeholder="Titre" class="taskinput" name="Titre" type="text" value={updatedTask.Titre} onChange={handleInputUpdateChange}/>
                      <textarea placeholder="Description" class="taskinput2" name="Description" type="text" value={updatedTask.Description} onChange={handleInputUpdateChange}/>
                    </form>
                  </div>
                  {/* Boutons pour annuler, modifier et supprimer la tâche */}
                  <div class="addtask-button-wrapper">
                    <button class="addtask-button" onClick={closeOverlay}>ANNULER </button>
                    <button class="addtask-button primary" onClick={handleUpdateTask}>MODIFIER <RxUpdate className='btn_icon'/></button>
                    <button class="addtask-button secondary" onClick={handleDeleteClick}>SUPPRIMER <ImCancelCircle className='btn_icon'/></button>
                  </div>
                </div>            
              </div>
            </div>
          )}
        </div>
      </div>
    ))}
</div>

    </div>
    </div>
  )
}

export default Workspace

