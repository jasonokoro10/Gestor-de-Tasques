const jwt = require('jsonwebtoken'); // Importem llibreria JWT

const generateToken = (id) => { // Funció per generar token
    return jwt.sign({ id }, process.env.JWT_SECRET, { // Creem token signat amb ID
        expiresIn: process.env.JWT_EXPIRES_IN // Configurem caducitat des de .env
    });
};

module.exports = generateToken; // Exportem la funció
