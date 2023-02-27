const { Schema, model } = require('mongoose')

//schema -> contrato(guia) a nivel de aplicacion , no a nivel de base de datos
const libroSchema = new Schema({
    titulo: String,
    genero:  String,
    autor: String,
    date: Date,
    resumen: String,
})

//cambiar el contrato del toJson
libroSchema.set('toJSON',{
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

//model
const Libro = model('libro', libroSchema)

module.exports = Libro