const { body, validationResult } = require('express-validator'); // Importem llibreria

// Reutilitzem el handler d'errors local o podríem exportar-lo a un fitxer comú
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req); // Comprovem errors
    if (!errors.isEmpty()) { // Si n'hi ha
        const extractedErrors = errors.array().map(err => ({ [err.path]: err.msg })); // Formatem
        return res.status(400).json({ // Retornem 400
            success: false, // Error
            error: 'Errors de validació', // Missatge
            details: extractedErrors // Detalls
        });
    }
    next(); // Continuem
};

exports.createTaskValidation = [
    body('title') // Títol
        .notEmpty() // Obligatori
        .withMessage('El títol és obligatori') // Error
        .trim() // Espais
        .isLength({ max: 100 }) // Màxim 100
        .withMessage('El títol no pot excedir els 100 caràcters'), // Error
    body('description') // Descripció
        .notEmpty() // Obligatori
        .withMessage('La descripció és obligatòria') // Error
        .isLength({ max: 500 }) // Màxim 500
        .withMessage('La descripció no pot excedir els 500 caràcters'), // Error
    body('cost') // Cost
        .isFloat({ min: 0 }) // Número positiu
        .withMessage('El cost ha de ser un número positiu'), // Error
    body('hours_estimated') // Hores
        .isFloat({ min: 0 }) // Número positiu
        .withMessage('Les hores estimades han de ser un número positiu'), // Error
    handleValidationErrors // Handler
];

exports.updateTaskValidation = [
    body('title') // Títol
        .optional() // Opcional
        .trim() // Espais
        .isLength({ max: 100 }) // Max 100
        .withMessage('El títol no pot excedir els 100 caràcters'), // Error
    body('description') // Descripció
        .optional() // Opcional
        .isLength({ max: 500 }) // Max 500
        .withMessage('La descripció no pot excedir els 500 caràcters'), // Error
    body('cost') // Cost
        .optional() // Opcional
        .isFloat({ min: 0 }) // Positiu
        .withMessage('El cost ha de ser un número positiu'), // Error
    body('hours_estimated') // Hores
        .optional() // Opcional
        .isFloat({ min: 0 }) // Positiu
        .withMessage('Les hores estimades han de ser un número positiu'), // Error
    body('completed') // Completada
        .optional() // Opcional
        .isBoolean() // Booleà
        .withMessage('Completed ha de ser booleà'), // Error
    handleValidationErrors // Handler
];
