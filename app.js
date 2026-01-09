const express = require('express'); // Importem Express Framework
const dotenv = require('dotenv'); // Gestio variables entorn
const mongoose = require('mongoose'); // Importem Mongoose (DB)
const cors = require('cors'); // Middleware CORS
const morgan = require('morgan'); // Logger HTTP
const ErrorResponse = require('./utils/errorResponse'); // Classe error personalitzada

// Carregar variables d'entorn
dotenv.config(); // Inicialitzem .env

// Connectar a la base de dades
mongoose.connect(process.env.MONGODB_URI) // Connexió a Mongo
    .then(() => console.log(`Connectat a MongoDB: ${mongoose.connection.host}`)) // Èxit
    .catch(err => { // Error
        console.error('Error connectant a MongoDB:', err); // Log error
        // Opcional: process.exit(1); si volem que l'app s'aturi si no hi ha DB
    });

// Rutes
const authRoutes = require('./routes/authRoutes'); // Rutes Auth
const taskRoutes = require('./routes/taskRoutes'); // Rutes Tasques
const adminRoutes = require('./routes/adminRoutes'); // Rutes Admin

const app = express(); // Inicialitzem App

// Middleware
app.use(express.json()); // Per parsejar body JSON
app.use(cors()); // Per permetre peticions d'altres dominis
if (process.env.NODE_ENV === 'development') { // Si estem en dev
    app.use(morgan('dev')); // Logger per desenvolupament
}

// Muntar rutes
app.use('/api/auth', authRoutes); // Prefix auth
app.use('/api/tasks', taskRoutes); // Prefix tasks
app.use('/api/admin', adminRoutes); // Prefix admin

// Ruta base per comprovar que funciona
app.get('/', (req, res) => { // Ruta arrel
    res.json({ // Retornem JSON
        success: true, // Èxit
        message: 'API del Gestor de Tasques funcionant correctament 🚀', // Missatge
        endpoints: { // Info endpoints
            auth: '/api/auth',
            tasks: '/api/tasks',
            admin: '/api/admin'
        }
    });
});

// Ruta per defecte (404)
app.use((req, res, next) => { // Middleware 404
    next(new ErrorResponse('Ruta no trobada', 404)); // Error ruta
});

// Middleware de gestió d'errors
app.use((err, req, res, next) => { // Middleware global errors
    let error = { ...err }; // Copiem error
    error.message = err.message; // Copiem missatge

    // Log a la consola per dev
    console.error(err); // Log error original

    // Mongoose bad ObjectId
    if (err.name === 'CastError') { // Error ID invàlid
        const message = `Recurs no trobat amb id: ${err.value}`; // Missatge
        error = new ErrorResponse(message, 404); // Error 404
    }

    // Mongoose duplicate key
    if (err.code === 11000) { // Error duplicat
        const message = 'Valors duplicats entrats'; // Missatge
        error = new ErrorResponse(message, 400); // Error 400
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') { // Error validació
        const message = Object.values(err.errors).map(val => val.message); // Missatges
        error = new ErrorResponse(message, 400); // Error 400
    }

    res.status(error.statusCode || 500).json({ // Resposta error
        success: false, // Error
        error: error.message || 'Error del Servidor' // Missatge final
    });
});

const PORT = process.env.PORT || 3000; // Port servidor

app.listen(PORT, () => { // Arrenquem servidor
    console.log(`Servidor funcionant en mode ${process.env.NODE_ENV} a http://localhost:${PORT}`); // Log start
});

module.exports = app; // Per si volem fer tests
