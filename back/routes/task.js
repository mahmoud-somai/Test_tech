// Import de mongoose pour les opérations liées à la base de données
const Task = require("../model/Task");
const router = require("express").Router();

// Récupération de toutes les tâches
router.get("/AllTasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Récupération d'une tâche spécifique par ID
router.get("/GetById/:id", async (req, res) => {
    try {
        const specificTask = await Task.findById(req.params.id);
        if (!specificTask) {
            return res.status(404).json({ error: 'Invalid ID' });
        }
        res.status(200).json(specificTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Récupération des tâches par ID d'utilisateur
router.get("/GetByUserId/:id_user", async (req, res) => {
    try {
      const tasksByUser = await Task.find({ id_user: req.params.id_user });
      res.status(200).json(tasksByUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Ajout d'une nouvelle tâche
router.post("/NewTask", async (req, res) => {
    try {
        // Vérification de la validité de la requête
      if (!req.body.Titre || !req.body.Description) {
        return res.status(400).json({ error: 'Invalid request.' });
      }
  
      const existingTask = await Task.findOne({ Titre: req.body.Titre });
  
      if (existingTask) {
        return res.status(400).json({ error: 'Task with the same title already exists.' });
      }
  
      // Si pas de titre en double, création et sauvegarde de la nouvelle tâche
      const newTask = new Task(req.body);
      await newTask.save();
  
      res.status(200).send("Task saved With Success");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Mise à jour d'une tâche par ID
router.patch("/UpdateTask/:id", async (req, res) => {
    try {
      const updateTask = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
  
      if (!updateTask) {
        console.log(`Task with ID ${req.params.id} not found`);
        return res.status(404).json({ error: 'Task not found' });
      }
  
      res.status(200).json(updateTask);
    } catch (error) {
      console.error(`Error updating task with ID ${req.params.id}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Suppression d'une tâche par ID
router.delete("/DeleteTask/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ error: 'Invalid ID' });
        }
        res.status(200).send("Task Has Been Deleted !!! ");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Récupération des tâches avec une date d'échéance ultérieure à la date fournie
router.get('/GetByDate/:date', async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const tasks = await Task.find({ DateEcheance: { $gte: date } });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Récupération des tâches par statut
router.get('/GetByStatut/:statut', async (req, res) => {
    try {
        const statut = req.params.statut.toLowerCase();
        const tasks = await Task.find({ Statut: statut });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Recherche de tâches par mot-clé
router.get('/search/:keyword', async (req, res) => {
    try {
        const keyword = req.params.keyword.toLowerCase();
        const tasks = await Task.fisnd({
            $or: [
                { Titre: { $regex: keyword, $options: 'i' } },
                { Description: { $regex: keyword, $options: 'i' } },
            ],
        });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Export du routeur
module.exports = router; 
