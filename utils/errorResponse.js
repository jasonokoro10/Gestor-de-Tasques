class ErrorResponse extends Error { // Estenem la classe Error nativa
    constructor(message, statusCode) { // Constructor amb missatge i codi
        super(message); // Passem missatge al pare
        this.statusCode = statusCode; // Assignem codi d'estat HTTP
    }
}

module.exports = ErrorResponse; // Exportem la classe
