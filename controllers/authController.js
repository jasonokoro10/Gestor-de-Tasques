const User = require('../models/User'); // Importem model Usuari
const ErrorResponse = require('../utils/errorResponse'); // Gestor d'errors
const generateToken = require('../utils/generateToken'); // Generador de JWT

// @desc    Registrar usuari
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body; // Extraiem dades del body

        // Crear usuari
        // La contrasenya es xifrarà al pre-save hook del model
        const user = await User.create({
            name, // Assignem nom
            email, // Assignem email
            password, // Assignem contrasenya
            role: 'user' // Forçar rol 'user' per seguretat
        });

        // Generar token
        const token = generateToken(user._id); // Generem token JWT

        res.status(201).json({ // Resposta creada (201)
            success: true, // Èxit
            message: 'Usuari registrat correctament', // Missatge
            data: {
                token, // Retornem token
                user // toJSON s'encarrega d'amagar el password
            }
        });
    } catch (error) {
        if (error.code === 11000) { // Codi duplicat Mongoose
            return next(new ErrorResponse('Aquest email ja està registrat', 400)); // Error 400
        }
        next(error); // Passem error genèric
    }
};

// @desc    Iniciar sessió
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body; // Extraiem credencials

        // Verificar email i password
        if (!email || !password) { // Validem camps
            return next(new ErrorResponse('Siusplau, introdueix un email i una contrasenya', 400)); // Error
        }

        // Buscar usuari i incloure password explícitament per comparar
        const user = await User.findOne({ email }).select('+password'); // Cerquem usuari + pwd

        if (!user) { // Si no existeix
            return next(new ErrorResponse('Credencials incorrectes', 401)); // Error a tot
        }

        // Comparar contrasenya
        const isMatch = await user.comparePassword(password); // Validem password

        if (!isMatch) { // Si no coincideix
            return next(new ErrorResponse('Credencials incorrectes', 401)); // Error a tot
        }

        // Generar token
        const token = generateToken(user._id); // Creem JWT

        // Eliminar password de la resposta (el mètode user.toJSON ho farà si retornem l'objecte sense select,
        // però com hem fet select('+password'), millor ocultar-lo manualment o tornar a fer query sense password)
        // Opció neta: Convertir a objecte i esborrar:
        const userResponse = user.toObject(); // Convertim a objecte JS
        delete userResponse.password; // Esborrem hash manualment

        res.status(200).json({ // Resposta OK
            success: true, // Èxit
            message: 'Sessió iniciada correctament', // Missatge
            data: {
                token, // Token
                user: userResponse // Usuari net
            }
        });
    } catch (error) {
        next(error); // Passem error
    }
};

// @desc    Obtenir usuari actual
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        // L'usuari ja està a req.user gràcies al middleware protect
        res.status(200).json({ // Resposta OK
            success: true, // Èxit
            data: req.user // Dades de l'usuari actual
        });
    } catch (error) {
        next(error); // Passem error
    }
};

// @desc    Actualitzar perfil
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        // Evitar canvi de rol o password per aquesta ruta
        if (req.body.password || req.body.role) { // Validem seguretat
            return next(new ErrorResponse('Aquesta ruta no és per canviar la contrasenya o el rol', 400)); // Error
        }

        const fieldsToUpdate = {
            name: req.body.name, // Nou nom
            email: req.body.email // Nou email
        };

        // Si canvia l'email, verificar que no estigui en ús per un altre
        if (req.body.email && req.body.email !== req.user.email) { // Comprovem email diferent
            const existingUser = await User.findOne({ email: req.body.email }); // Cerquem duplicats
            if (existingUser) {
                return next(new ErrorResponse('Aquest email ja està en ús', 400)); // Error
            }
        }

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, { // Actualitzem
            new: true, // Retornar nou doc
            runValidators: true // Executar validacions
        });

        res.status(200).json({ // Resposta OK
            success: true, // Èxit
            data: user // Usuari actualitzat
        });
    } catch (error) {
        next(error); // Passem error
    }
};

// @desc    Canviar contrasenya
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body; // Extraiem passwords

        // Buscar usuari amb password
        const user = await User.findById(req.user.id).select('+password'); // Cerquem usuari + pwd actual

        // Verificar contrasenya actual
        if (!(await user.comparePassword(currentPassword))) { // Validem pwd actual
            return next(new ErrorResponse('La contrasenya actual és incorrecta', 401)); // Error
        }

        user.password = newPassword; // Assignem nova pwd
        await user.save(); // Això executarà el pre-save hook i farà el hash

        res.status(200).json({ // Resposta OK
            success: true, // Èxit
            message: 'Contrasenya actualitzada correctament' // Missatge
        });
    } catch (error) {
        next(error); // Passem error
    }
};
