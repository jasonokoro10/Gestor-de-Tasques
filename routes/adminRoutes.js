const express = require('express'); // Importem Express
const { // Desestructurem controladors
    getAllUsers,
    getAllTasks,
    deleteUser,
    changeUserRole
} = require('../controllers/adminController');

const { protect } = require('../middleware/auth'); // Middleware auth
const { roleCheck } = require('../middleware/roleCheck'); // Middleware rols

const router = express.Router(); // Creem router

// Totes les rutes d'admin requereixen autenticació i rol 'admin'
router.use(protect); // Apliquem protecció global
router.use(roleCheck('admin')); // Apliquem rol admin global

router.get('/users', getAllUsers); // Rutas usuaris
router.get('/tasks', getAllTasks); // Ruta tasques
router.delete('/users/:id', deleteUser); // Ruta esborrar
router.put('/users/:id/role', changeUserRole); // Ruta rol

module.exports = router; // Exportem router
