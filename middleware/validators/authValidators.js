const { body, validationResult } = require('express-validator'); // Importem llibreria de validació

// Middleware per gestionar els errors de validació
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req); // Comprovem si hi ha errors
    if (!errors.isEmpty()) { // Si hi ha errors
        const extractedErrors = errors.array().map(err => ({ [err.path]: err.msg })); // Formatem errors
        // Retornem un 400 Bad Request amb els errors
        return res.status(400).json({ // Retornem resposta
            success: false, // Error
            error: 'Errors de validació', // Missatge
            details: extractedErrors // Detalls
        });
    }
    next(); // Continuem si tot ok
};

exports.registerValidation = [
    body('name') // Camp name
        .optional() // Opcional
        .trim() // Traiem espais
        .isLength({ min: 2 }) // Mínim 2 caràcters
        .withMessage('El nom ha de tenir almenys 2 caràcters'), // Missatge error
    body('email') // Camp email
        .isEmail() // Format email vàlid
        .withMessage('Siusplau, introdueix un email vàlid') // Missatge
        .normalizeEmail(), // Normalitzem (minúscules)
    body('password') // Camp password
        .isLength({ min: 6 }) // Mínim 6 caràcters
        .withMessage('La contrasenya ha de tenir almenys 6 caràcters'), // Missatge
    handleValidationErrors // Executem handler
];

exports.loginValidation = [
    body('email') // Camp email
        .isEmail() // Validem format
        .withMessage('Siusplau, introdueix un email vàlid') // Error
        .normalizeEmail(), // Normalitzem
    body('password') // Camp password
        .exists() // Ha d'existir
        .withMessage('La contrasenya és obligatòria'), // Error
    handleValidationErrors // Executem handler
];

exports.updateProfileValidation = [
    body('name') // Camp name
        .optional() // Opcional
        .trim() // Sanitize
        .isLength({ min: 2 }) // Validem longitud
        .withMessage('El nom ha de tenir almenys 2 caràcters'), // Error
    body('email') // Camp email
        .optional() // Opcional
        .isEmail() // Validem format
        .withMessage('Siusplau, introdueix un email vàlid') // Error
        .normalizeEmail(), // Sanitize
    handleValidationErrors // Handler
];

exports.changePasswordValidation = [
    body('currentPassword') // Password actual
        .notEmpty() // Obligatori
        .withMessage('La contrasenya actual és necessària'), // Error
    body('newPassword') // Nova password
        .isLength({ min: 6 }) // Longitud mínima
        .withMessage('La nova contrasenya ha de tenir almenys 6 caràcters'), // Error
    handleValidationErrors // Handler
];
