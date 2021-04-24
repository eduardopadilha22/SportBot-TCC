// contactModel.js
var mongoose = require('mongoose');
// Setup schema
var usuarioSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cargo: {
        type: String,
        required: true
    },
    setor: {
        type: String,
        required: true
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

var usuario = module.exports = mongoose.model('usuarios', usuarioSchema);
module.exports.get = function (callback, limit) {
    usuario.find(callback).limit(limit);
}