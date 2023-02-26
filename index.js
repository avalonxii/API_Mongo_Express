//usuario -> juanma
//psww -> clave13
require('./mongo') //ejecuta el archivo de mongo.js conectandose a la base de datos de mongoDB

const express = require('express')
const cors = require('cors')
const Usuario = require('./models/Usuario')

const app = express()

//usamos el cors
app.use(cors())

//rutas con express

    //ruta de inicio
    app.get('/', (req, res) => {res.send('<h1>hola mundo</h1>')})

//Rest API
    //ruta de la Api
    const API_URL = '/api/usuarios'

    //-- Obtener todos los recursos
    app.get(API_URL, (req, res) => {
        Usuario.find({})
            .then(usuarios => res.json(usuarios))
    })

    //-- Obtener un recurso (:id -> ruta dinamica)
    app.get(`${API_URL}/:id`, (req, res, next) => {
        //obtenemos el id -> parametro de la ruta dinamica
        const {id} = req.params  // de normal lo devuelve como string asique hay que a veces cambiarlo a number

        //buscamos el elemento que conicida por id
        Usuario.findById(id).then(usuario =>{
            if(usuario){
                //devolvemos el elemento que conicide
                return res.json(usuario)
            }else {
                //devolvemos not found
                res.status(404).end()
            }
        }).catch(err => next(err)) // next() -> lño envia al siguiente middleware
    })

    //-- Crear recurso
    app.post(API_URL, (req, res) => {

        //los datos que se reciben
        const usuario = req.body

        //crea nota
        const newUsuario = new Usuario({
            nombre: usuario.nombre,
            date: new Date(),
            content: usuario.content
        })

        //guarda la nota en la abse de datos y devuelve la nota creada si todo ha ido bien
        newUsuario.save().then(savedNote => res.json(savedNote))
    })

    //-- Editar recurso
    app.put(`${API_URL}/:id`, (req, res, next) => {
        const {id} = req.params

        const usuario = req.body

        const newUsuarioInfo = new Usuario({
            nombre: usuario.nombre,
            date: new Date(),
            content: usuario.content
        })

        Usuario.findByIdAndUpdate(id, newUsuarioInfo, {new :true}) //para que me devuelva el elemento actualziado
        .then(result => {res.json(result)})
    })

    //-- Eliminar recurso
    app.delete(`${API_URL}/:id`, (req, res, next) => {

        const {id} = req.params

        //busca un elemento por su id y lo elimina
        Usuario.findByIdAndDelete(id).then(result => { //tmb se puede usar findByIdAndRemove

            //devuelve un status de not content
            res.status(204).end()
        }).catch(error => next(error))
    })


//Middelware -> controlar mejor los errores
app.use((req, res, next) => {
    res.status(404).end() // por sino entra en ningun endpoint
})

app.use((error, req, res, next) => {
    console.error(error)
    console.log(error.name) 

    if(error.name === 'CastError'){ //si introduce mal el id
        res.status(400).send({error: 'id no esta bien usada'})
    }else {
        res.status(500).end()
    }
})

//levantar servidor en puerto 3001
const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`);
})