const jwt = require('jsonwebtoken'); // Importem llibreria JWT
const ErrorResponse = require('../utils/errorResponse'); // Gestor d'errors
const User = require('../models/User'); // Model d'usuari

exports.protect = async (req, res, next) => {
    let token; // Variable per guardar el token

    // Verificar si existeix el header Authorization i comença per Bearer
    if (
        req.headers.authorization && // Comprovem header
        req.headers.authorization.startsWith('Bearer') // Comprovem prefix
    ) {
        // Extreure el token (Beareres un string)
        token = req.headers.authorization.split(' ')[1]; // Agafem la part del token
    }

    // Comprovar si el token existeix
    if (!token) { // Si no hi ha token
        return next(new ErrorResponse('Sense accés. Token no proporcionat.', 401)); // Error 401
    }

    try {
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Descodifiquem i verifiquem

        // Buscar l'usuari a la base de dades
        const user = await User.findById(decoded.id); // Busquem usuari per ID del token

        if (!user) { // Si no existeix
            return next(new ErrorResponse('Usuari no trobat amb aquest token', 401)); // Error
        }

        // Afegir l'usuari a la request per utilitzar-lo a les rutes
        req.user = user; // Guardem usuari a req

        next(); // Continuem al següent middleware
    } catch (error) {
        return next(new ErrorResponse('Token invàlid o expirat', 401)); // Error de token
    }
};
