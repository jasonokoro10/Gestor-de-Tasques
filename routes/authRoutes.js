const express = require('express'); // Importem Express
const { // Desestructurem controladors
    register,
    login,
    getMe,
    updateProfile,
    changePassword
} = require('../controllers/authController');

const { protect } = require('../middleware/auth'); // Middleware auth
const { // Importem validadors
    registerValidation,
    loginValidation,
    updateProfileValidation,
    changePasswordValidation
} = require('../middleware/validators/authValidators');

const router = express.Router(); // Creem router

router.post('/register', registerValidation, register); // Ruta registre
router.post('/login', loginValidation, login); // Ruta login
router.get('/me', protect, getMe); // Ruta perfil
router.put('/profile', protect, updateProfileValidation, updateProfile); // Ruta update
router.put('/change-password', protect, changePasswordValidation, changePassword); // Ruta password

module.exports = router; // Exportem router
