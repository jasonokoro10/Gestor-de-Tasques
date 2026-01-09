const Task = require('../models/Task'); // Importem model Tasca
const ErrorResponse = require('../utils/errorResponse'); // Gestor d'errors

// @desc    Crear tasca
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res, next) => {
    try {
        // Afegir usuari al body
        req.body.user = req.user.id; // Assignem l'ID de l'usuari autenticat

        const task = await Task.create(req.body); // Creem la tasca a BD

        res.status(201).json({ // Resposta creada (201)
            success: true, // Èxit
            data: task // Retornem la tasca
        });
    } catch (error) {
        next(error); // Passem error
    }
};

// @desc    Obtenir totes les tasques de l'usuari
// @route   GET /api/tasks
// @access  Private
exports.getAllTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ user: req.user.id }); // Filtrem per l'usuari actual

        res.status(200).json({ // Resposta OK
            success: true, // Èxit
            count: tasks.length, // Nombre total
            data: tasks // Array de tasques
        });
    } catch (error) {
        next(error); // Passem error
    }
};

// @desc    Obtenir una tasca per ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res, next) => {
    try {
        // Cerquem per ID de tasca i ID d'usuari (seguretat)
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) { // Si no es troba
            return next(new ErrorResponse(`Tasca no trobada amb id ${req.params.id}`, 404)); // Error 404
        }

        res.status(200).json({ // Resposta OK
            success: true, // Èxit
            data: task // Detall tasca
        });
    } catch (error) {
        next(error); // Passem error
    }
};

// @desc    Actualitzar una tasca
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
    try {
        // Verifiquem primer que existeix i pertany a l'usuari
        let task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) { // Si no existeix
            return next(new ErrorResponse(`Tasca no trobada amb id ${req.params.id}`, 404)); // Error 404
        }

        // Evitar que l'usuari canviï el propietari (user)
        if (req.body.user) { // Si intenten canviar propietari
            delete req.body.user; // Ho ignorem
        }

        // Actualitzem les dades
        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Retornar el document nou
            runValidators: true // Executar validadors del model
        });

        res.status(200).json({ // Resposta OK
            success: true, // Èxit
            data: task // Tasca actualitzada
        });
    } catch (error) {
        next(error); // Passem error
    }
};

// @desc    Eliminar una tasca
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
    try {
        // Cerquem tasca pròpia
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) { // Si no existeix
            return next(new ErrorResponse(`Tasca no trobada amb id ${req.params.id}`, 404)); // Error 404
        }

        await task.deleteOne(); // Esborrem tasca

        res.status(200).json({ // Resposta OK
            success: true, // Èxit
            data: {} // Dades buides
        });
    } catch (error) {
        next(error); // Passem error
    }
};

// @desc    Obtenir estadístiques de l'usuari
// @route   GET /api/tasks/stats
// @access  Private
exports.getTaskStats = async (req, res, next) => {
    try {
        // Exemple d'agregació simple
        const stats = await Task.aggregate([ // Executem pipeline d'agregació
            { $match: { user: req.user._id } }, // 1. Filtrem: només tasques meves
            {
                $group: { // 2. Agrupem resultats
                    _id: null, // Tot en un sol grup
                    totalTasks: { $sum: 1 }, // Contem total
                    totalCost: { $sum: "$cost" }, // Sumem costos
                    totalHours: { $sum: "$hours_estimated" }, // Sumem hores
                    completedTasks: { // Contem completades
                        $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] } // Sumem 1 si completed=true
                    }
                }
            }
        ]);

        // Retornem l'estadística o valors a zero si no hi ha dades
        res.status(200).json({ // Resposta OK
            success: true, // Èxit
            data: stats[0] || { totalTasks: 0, totalCost: 0, totalHours: 0, completedTasks: 0 } // Resultat
        });
    } catch (error) {
        next(error); // Passem error
    }
};
