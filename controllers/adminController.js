const User = require('../models/User'); // Importem model Usuari
const Task = require('../models/Task'); // Importem model Tasca
const ErrorResponse = require('../utils/errorResponse'); // Gestor d'errors

// @desc    Obtenir tots els usuaris
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }); // Cerquem tots i ordenem

        res.status(200).json({ // Resposta exitosa
            success: true, // Èxit
            count: users.length, // Nombre total
            data: users // Llistat usuaris
        });
    } catch (error) {
        next(error); // Passem error
    }
};

// @desc    Obtenir totes les tasques del sistema
// @route   GET /api/admin/tasks
// @access  Private/Admin
exports.getAllTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find().populate('user', 'name email role'); // Tasques + dades usuari

        res.status(200).json({ // Resposta OK
            success: true, // Èxit
            count: tasks.length, // Total tasques
            data: tasks // Array tasques
        });
    } catch (error) {
        next(error); // Error al middleware
    }
};

// @desc    Eliminar un usuari i les seves tasques
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id); // Busquem usuari per ID

        if (!user) { // Si no existeix
            return next(new ErrorResponse(`Usuari no trobat amb id ${req.params.id}`, 404)); // Error 404
        }

        // Evitar que l'admin s'elimini a si mateix
        if (user._id.toString() === req.user.id) { // Comprovem ID propi
            return next(new ErrorResponse('No et pots eliminar a tu mateix', 400)); // Error seguretat
        }

        // Eliminar també les tasques de l'usuari
        await Task.deleteMany({ user: user._id }); // Esborrem tasques associades

        await user.deleteOne(); // Esborrem l'usuari

        res.status(200).json({ // Resposta OK
            success: true, // Èxit
            message: 'Usuari i les seves tasques eliminats correctament', // Missatge
            data: {} // Dades buides
        });
    } catch (error) {
        next(error); // Gestió errors
    }
};

// @desc    Canviar el rol d'un usuari
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.changeUserRole = async (req, res, next) => {
    try {
        const { role } = req.body; // Extraiem nou rol

        if (!['user', 'admin'].includes(role)) { // Validem rol permès
            return next(new ErrorResponse('Rol invàlid. Els rols vàlids són user i admin', 400)); // Error
        }

        const user = await User.findById(req.params.id); // Busquem usuari

        if (!user) { // No trobat
            return next(new ErrorResponse(`Usuari no trobat amb id ${req.params.id}`, 404)); // Error 404
        }

        // Evitar que l'admin es canvii el rol a si mateix
        if (user._id.toString() === req.user.id) { // ID coincideix
            return next(new ErrorResponse('No pots canviar el teu propi rol', 400)); // Error
        }

        user.role = role; // Assignem nou rol
        await user.save(); // Guardem canvis

        res.status(200).json({ // Retornem OK
            success: true, // Èxit
            data: user // Usuari actualitzat
        });
    } catch (error) {
        next(error); // Passem error
    }
};
