const mongoose = require('mongoose'); // Importem Mongoose
const bcrypt = require('bcryptjs'); // Importem librería d'encriptació

const userSchema = new mongoose.Schema({ // Definim esquema Usuari
    name: { // Camp nom
        type: String, // String
        trim: true, // Sense espais sobrants
        minlength: [2, 'El nom ha de tenir almenys 2 caràcters'] // Mínim 2
    },
    email: { // Camp email
        type: String, // String
        required: [true, 'Siusplau, afegeix un email'], // Obligatori
        unique: true, // Únic a la BD
        match: [ // Validació Regex
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Siusplau, afegeix un email vàlid'
        ],
        lowercase: true, // Forcem minúscules
        trim: true // Sense espais
    },
    password: { // Camp password
        type: String, // String
        required: [true, 'Siusplau, afegeix una contrasenya'], // Obligatori
        minlength: [6, 'La contrasenya ha de tenir almenys 6 caràcters'], // Mínim 6
        select: false // Per seguretat, no retornar la contrasenya per defecte
    },
    role: { // Camp rol
        type: String, // String
        enum: ['user', 'admin'], // Valors permesos
        default: 'user' // Valor per defecte
    },
    createdAt: { // Data creació
        type: Date, // Date
        default: Date.now // Ara
    },
    updatedAt: { // Data edició
        type: Date, // Date
        default: Date.now // Ara
    }
}, {
    timestamps: true // Gestiona automàticament createdAt i updatedAt
});

// Encriptar la contrasenya abans de guardar
userSchema.pre('save', async function () {
    // Si la contrasenya no s'ha modificat, no fem res
    if (!this.isModified('password')) { // Check modificació
        return; // Sortim
    }

    // No cal try-catch aquí, si falla la promesa es rebutja i Mongoose captura l'error
    const salt = await bcrypt.genSalt(10); // Generem salt
    this.password = await bcrypt.hash(this.password, salt); // Encriptem password
});

// Mètode per comparar contrasenyes
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password); // Comparem hash
};

// Mètode per retornar l'objecte sense dades sensibles (password)
// Nota: Quan usem select: false al schema, ja evitem que surti en queries normals,
// però això assegura que si tenim l'objecte complet, al passar a JSON el neteja.
userSchema.methods.toJSON = function () {
    const userObject = this.toObject(); // Convertim a objecte
    delete userObject.password; // Esborrem password
    delete userObject.__v; // Esborrem versió Mongoose
    return userObject; // Retornem net
};

module.exports = mongoose.model('User', userSchema); // Exportem model
