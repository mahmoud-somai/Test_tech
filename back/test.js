const request = require('supertest');
const Task = require('./model/Task');
const app = require('./app');
const mongoose = require('mongoose');

// Avant tous les tests, connectez-vous à la base de données MongoDB
beforeAll(async () => {
  await mongoose.connect(process.env.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Après tous les tests, fermez la connexion à la base de données
afterAll(async () => {
  await mongoose.connection.close();
});

// Tests pour les routes liées aux tâches
describe('Task Routes', () => {
  // Cas limite : Aucune tâche dans la base de données
  describe('Récupérez les tâches - Cas Limite', () => {
    it('devrait retourner un tableau vide lorsqu\'il n\'y a aucune tâche dans la base de données', async () => {
      // Vérifiez s'il y a des tâches dans la base de données
      const tasksInDatabase = await Task.find();

      // S'il y a des tâches, supprimez-les
      if (tasksInDatabase.length > 0) {
        await Task.deleteMany({});
      }

      // Récupérez les tâches après que la base de données a été vidée
      const response = await request(app).get('/api/AllTasks');

      // Attentes
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });
  });

  // Tests pour la création d'une nouvelle tâche
  describe('créer une nouvelle tâche - Cas Complexe', () => {
    it('devrait créer une nouvelle tâche et renvoyer un message de succès', async () => {
      // Créez des données d'échantillon pour une nouvelle tâche
      const taskData = {
        Titre: 'Nouvelle Tâche',
        Description: 'Description de la nouvelle tâche',
      };

      // Effectuez une requête pour créer une nouvelle tâche
      const response = await request(app).post('/api/NewTask').send(taskData);

      // Attentes
      expect(response.status).toBe(200);
      expect(response.text).toBe('Task saved With Success');

      // Vérifiez si la tâche est réellement enregistrée dans la base de données
      const createdTask = await Task.findOne({ Titre: 'Nouvelle Tâche' });
      expect(createdTask).toBeTruthy();
      expect(createdTask.Description).toBe('Description de la nouvelle tâche');
    });

    it('devrait gérer une demande invalide et renvoyer 400 avec un message d\'erreur', async () => {
      // Créez des données de tâche invalides avec des propriétés manquantes
      const invalidTaskData = {
        Description: 'Données de tâche invalides',
      };

      // Effectuez une requête avec des données invalides
      const response = await request(app).post('/api/NewTask').send(invalidTaskData);

      // Attentes
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid request.' });
    });

    it('devrait gérer la création d\'une tâche avec le même titre et renvoyer 400 avec un message d\'erreur', async () => {
      // Créez une tâche avec le même titre dans la base de données
      const existingTask = new Task({
        Titre: 'Tâche Existante',
        Description: 'Description de la tâche existante',
      });
      await existingTask.save();

      // Tentez de créer une nouvelle tâche avec le même titre
      const duplicateTaskData = {
        Titre: 'Tâche Existante',
        Description: 'Tentative de création d\'une tâche avec le même titre',
      };

      // Effectuez une requête avec un titre en double
      const response = await request(app).post('/api/NewTask').send(duplicateTaskData);

      // Attentes
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Task with the same title already exists.' });
    });
  });

  // Tests pour l'ajout d'un nouvel utilisateur
  describe('Ajouter un Nouvel Utilisateur - Cas Lmite', () => {
    it('devrait ajouter un nouvel utilisateur', async () => {
      const nouvelUtilisateur = {
        email: 'testemail@example.com',
        password: 'password123',
      };

      const response = await request(app).post('/api/newuser').send(nouvelUtilisateur);
      expect(response.status).toBe(200);
    });
  });

  // Tests pour la connexion d'un utilisateur
  describe('Connexion d\'Utilisateur - Cas Complexe', () => {
    it('devrait permettre la connexion d\'un utilisateur avec des identifiants corrects', async () => {
      const identifiantsValides = {
        email: 'testemail@example.com',
        password: 'password123',
      };

      // Supposons que vous ayez un utilisateur avec les identifiants spécifiés dans la base de données
      // Vous devrez peut-être créer un utilisateur avec ces identifiants avant d'exécuter le test

      const response = await request(app).post('/api/login').send(identifiantsValides);

      // Attentes
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', identifiantsValides.email);
    });

    it('devrait gérer un email invalide', async () => {
      const identifiantsEmailInvalide = {
        email: 'emailinvalide@example.com',
        password: 'password123',
      };

      const response = await request(app).post('/api/login').send(identifiantsEmailInvalide);

      // Attentes
      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid Email');
    });

    it('devrait gérer un mot de passe incorrect', async () => {
      const identifiantsMauvaisMotDePasse = {
        email: 'testemail@example.com',
        password: 'mauvaismotdepasse',
      };

      const response = await request(app).post('/api/login').send(identifiantsMauvaisMotDePasse);

      // Attentes
      expect(response.status).toBe(400);
      expect(response.text).toBe('Wrong password');
    });

    it('devrait gérer des identifiants manquants', async () => {
      const identifiantsManquants = {}; // Aucun email et mot de passe fourni

      const response = await request(app).post('/api/login').send(identifiantsManquants);

      // Attentes
      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid Email');
    });

  });
});
