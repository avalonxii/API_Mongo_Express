const { Schema, model } = require('mongoose')

//schema -> contrato(guia) a nivel de aplicacion , no a nivel de base de datos
const usuarioSchema = new Schema({
    nombre: String,
    date: Date,
    content: String,
})

//cambiar el contrato del toJson
usuarioSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

//model
const Usuario = model('usuario', usuarioSchema)

module.exports = Usuario