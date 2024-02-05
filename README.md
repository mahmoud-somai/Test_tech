# Application de Gestion de Tâches

L'application web personnalisée offre une solution efficace pour organiser et gérer les tâches quotidiennes de manière optimale.

## Fonctionnalités

- **Interface Conviviale :** Une interface utilisateur intuitive permet aux utilisateurs de créer, éditer et supprimer des tâches en quelques clics.
  
- **Recherche Avancée :** La fonctionnalité de recherche avancée permet de filtrer les tâches par date d'échéance, statut et effectuer des recherches par mot-clé.

# Configuration Backend

### Installation des dépendances
Exécutez la commande suivante pour installer les dépendances :
```bash
npm install
```
Assurez-vous que MongoDB est installé et en cours d'exécution.
Créez un fichier .env à la racine du dossier `back`

```bash
db=URL_de_votre_base_de_donnees_MongoDB
```
### Démarrage du serveur:
```bash
npm start
```

# Configuration Frontend

### Installation des dépendances
Exécutez la commande suivante pour installer les dépendances :
```bash
npm install
```
Assurer la connexion entre le backend et le frontend par modifier les fichiers `src/services/user.js` et `src/services/task.js`

```bash
const url = "http://localhost:5000/api";
```

### Démarrage de l'application:
```bash
npm start
```


# Points d'accès liés aux tâches :

1. **GET /AllTasks**

   - *Description :* Récupérer toutes les tâches de la base de données.
   - *Réponse :* Retourne un tableau de toutes les tâches.

2. **GET /GetById/:id**

   - *Description :* Récupérer une tâche spécifique par son ID.
   - *Réponse :* Retourne la tâche avec l'ID spécifié.

3. **GET /GetByUserId/:id_user**

   - *Description :* Récupérer les tâches associées à un ID d'utilisateur spécifique.
   - *Réponse :* Retourne un tableau de tâches associées à l'ID utilisateur spécifié.

4. **POST /NewTask**

   - *Description :* Ajouter une nouvelle tâche à la base de données.
   - *Corps de la requête :* Nécessite un objet JSON avec les champs "Titre" et "Description".
   - *Réponse :* En cas de succès, retourne un message de réussite ; sinon, retourne un message d'erreur.

5. **PATCH /UpdateTask/:id**

   - *Description :* Mettre à jour une tâche par son ID.
   - *Corps de la requête :* Accepte un objet JSON avec les champs à mettre à jour.
   - *Réponse :* Retourne la tâche mise à jour.

6. **DELETE /DeleteTask/:id**

   - *Description :* Supprimer une tâche par son ID.
   - *Réponse :* Retourne un message de réussite si la suppression est réussie.

7. **GET /GetByDate/:date**

   - *Description :* Récupérer les tâches avec une date d'échéance ultérieure à la date fournie.
   - *Réponse :* Retourne un tableau de tâches.

8. **GET /GetByStatut/:statut**

   - *Description :* Récupérer les tâches par leur statut.
   - *Réponse :* Retourne un tableau de tâches avec le statut spécifié.

9. **GET /search/:keyword**

   - *Description :* Rechercher des tâches contenant un mot-clé spécifié dans le titre ou la description.
   - *Réponse :* Retourne un tableau de tâches correspondant au mot-clé.

# Points d'accès liés aux utilisateurs :

1. **POST /newuser**

   - *Description :* Créer un nouvel utilisateur.
   - *Corps de la requête :* Nécessite un e-mail et un mot de passe.
   - *Réponse :* Retourne un message de réussite si l'utilisateur est créé ; sinon, retourne un message d'erreur.

2. **POST /login**

   - *Description :* Authentifier un utilisateur et générer un jeton JWT pour une autorisation ultérieure.
   - *Corps de la requête :* Nécessite un e-mail et un mot de passe pour l'authentification.
   - *Réponse :* Retourne un jeton JWT et l'ID de l'utilisateur si l'authentification est réussie ; sinon, retourne un message d'erreur.
