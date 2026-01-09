const mongoose = require('mongoose'); // Importem Mongoose

const taskSchema = new mongoose.Schema({ // Definim esquema Tasca
    title: { // Camp títol
        type: String, // Tipus string
        required: [true, 'Siusplau, afegeix un títol'], // Obligatori amb error
        trim: true, // Eliminem espais
        maxlength: [100, 'El títol no pot tenir més de 100 caràcters'] // Màxima longitud
    },
    description: { // Camp descripció
        type: String, // Tipus string
        required: [true, 'Siusplau, afegeix una descripció'], // Obligatori
        maxlength: [500, 'La descripció no pot tenir més de 500 caràcters'] // Max 500
    },
    cost: { // Camp cost
        type: Number, // Tipus numèric
        required: [true, 'Siusplau, afegeix un cost'], // Obligatori
        min: [0, 'El cost no pot ser negatiu'] // Valor mínim 0
    },
    hours_estimated: { // Hores estimades
        type: Number, // Tipus numèric
        required: [true, 'Siusplau, afegeix les hores estimades'], // Obligatori
        min: [0, 'Les hores no poden ser negatives'] // Valor mínim 0
    },
    completed: { // Estat completat
        type: Boolean, // Booleà
        default: false // Per defecte fals
    },
    user: { // Relació amb Usuari
        type: mongoose.Schema.Types.ObjectId, // Tipus ID de Mongo
        ref: 'User', // Referència al model User
        required: true, // Obligatori
        index: true // Millora el rendiment de les cerques per usuari
    },
    createdAt: { // Data creació
        type: Date, // Tipus data
        default: Date.now // Per defecte ara
    }
});

module.exports = mongoose.model('Task', taskSchema); // Exportem model
