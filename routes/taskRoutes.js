const express = require('express'); // Importem Express
const { // Desestructurem controladors
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskStats
} = require('../controllers/taskController');

// Middleware d'autenticació
const { protect } = require('../middleware/auth'); // Middleware auth
const { createTaskValidation, updateTaskValidation } = require('../middleware/validators/taskValidators'); // Validadors

const router = express.Router(); // Creem router

// Totes les rutes de tasques requereixen autenticació
router.use(protect); // Protecció global tasques

router.route('/stats').get(getTaskStats); // Important: stats abans que :id

router.route('/') // Rutes arrel tasques
    .get(getAllTasks) // Llistar
    .post(createTaskValidation, createTask); // Crear

router.route('/:id') // Rutes per ID
    .get(getTaskById) // Llegir
    .put(updateTaskValidation, updateTask) // Editar
    .delete(deleteTask); // Eliminar

module.exports = router; // Exportem router
