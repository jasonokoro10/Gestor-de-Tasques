const ErrorResponse = require('../utils/errorResponse'); // Gestor d'errors

exports.roleCheck = (...roles) => { // Funció que rep rols permesos
    return (req, res, next) => {
        // Comprovar si l'usuari està autenticat (req.user existeix)
        if (!req.user) { // Seguretat extra
            return next(new ErrorResponse('Usuari no autenticat', 401)); // Error
        }

        // Comprovar si el rol de l'usuari està inclòs en els rols permesos
        if (!roles.includes(req.user.role)) { // Si rol no permès
            return next(
                new ErrorResponse(
                    `L'usuari amb rol ${req.user.role} no està autoritzat`, // Missatge detallat
                    403 // Forbidden (Prohibit)
                )
            );
        }
        next(); // Continuem
    };
};
