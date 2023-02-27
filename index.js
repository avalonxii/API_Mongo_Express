//usuario -> juanma
//psww -> clave13
require('./mongo') //ejecuta el archivo de mongo.js conectandose a la base de datos de mongoDB

const express = require('express')
const cors = require('cors')
//const bodyParser = require('body-parser')
const Usuario = require('./models/Usuario')
const Libro = require('./models/Libro')

const app = express()

//body parser (para pasar el cuerpo de las peticiones)
app.use(express.json());

//usamos el cors
app.use(cors('*'))

//rutas con express

    //ruta de inicio
    app.get('/', (req, res) => {res.send('<h1>hola mundo</h1>')})

//Rest API -> Endponits ----------------- --------------- Usuarios
    //ruta de la Api usuarios
    const API_URL_usuarios = '/api/usuarios'

    //-- Obtener todos los recursos
    app.get(API_URL_usuarios, (req, res) => {
        Usuario.find({})
            .then(usuarios => res.json(usuarios))
    })

    //-- Obtener un recurso (:id -> ruta dinamica)
    app.get(`${API_URL_usuarios}/:id`, (req, res, next) => {
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
    app.post(API_URL_usuarios, (req, res) => {

        //los datos que se reciben, destruturing
        const {name, content} = req.body

        //crea nota
        const newUsuario = new Usuario({
            name, // name: name
            date: new Date(),
            content
        })

        //guarda la nota en la abse de datos y devuelve la nota creada si todo ha ido bien
        newUsuario.save().then(savedNote => res.json(savedNote))
    })

    //-- Editar recurso
    app.put(`${API_URL_usuarios}/:id`, (req, res, next) => {
        const {id} = req.params

        const {name, content} = req.body

        const newUsuarioInfo = new Usuario({
            name,
            date: new Date(),
            content
        })

        Usuario.findByIdAndUpdate(id, newUsuarioInfo, {new :true}) // para no machacar el documento y solo actualizarlo
            //para que me devuelva el elemento actualziado
            .then(result => {res.json(result)})
    })

    //-- Eliminar recurso
    app.delete(`${API_URL_usuarios}/:id`, (req, res, next) => {

        const {id} = req.params

        //busca un elemento por su id y lo elimina
        Usuario.findByIdAndDelete(id).then(result => { //tmb se puede usar findByIdAndRemove

            //devuelve un status de not content
            res.status(204).end()
        }).catch(error => next(error))
    })


//Rest API -> Endponits ----------------- ----------------- Libros
    //ruta de la Api
    const API_URL_libros = '/api/libros'

    //-- Obtener todos los recursos
    app.get(API_URL_libros, (req, res) => {
        Libro.find({})
            .then(libros => res.json(libros))
    })

    //-- Obtener un recurso (:id -> ruta dinamica)
    app.get(`${API_URL_libros}/:id`, (req, res, next) => {
        //obtenemos el id -> parametro de la ruta dinamica
        const {id} = req.params  // de normal lo devuelve como string asique hay que a veces cambiarlo a number

        //buscamos el elemento que conicida por id
        Libro.findById(id).then(libro =>{
            if(libro){
                //devolvemos el elemento que conicide
                return res.json(libro)
            }else {
                //devolvemos not found
                res.status(404).end()
            }
        }).catch(err => next(err)) // next() -> lño envia al siguiente middleware
    })

    //-- Crear recurso
    app.post(API_URL_libros, (req, res) => {

        //los datos que se reciben, destruturing
        const {titulo, genero, autor, resumen} = req.body

        //crea nota
        const newLibro = new Libro({
            titulo,
            genero,
            autor,
            date: new Date(),
            resumen
        })

        //guarda la nota en la abse de datos y devuelve la nota creada si todo ha ido bien
        newLibro.save().then(savedLibro => res.json(savedLibro))
    })

    //-- Editar recurso
    app.put(`${API_URL_libros}/:id`, (req, res, next) => {
        const {id} = req.params

        const {titulo, genero, autor, resumen} = req.body

        //crea nota
        const newLibro = new Libro({
            titulo,
            genero,
            autor,
            date: new Date(),
            resumen
        })

        Libro.findByIdAndUpdate(id, newLibro, {new :true}) // para no machacar el documento y solo actualizarlo
            //para que me devuelva el elemento actualziado
            .then(result => {res.json(result)})
    })

    //-- Eliminar recurso
    app.delete(`${API_URL_libros}/:id`, (req, res, next) => {

        const {id} = req.params

        //busca un elemento por su id y lo elimina
        Libro.findByIdAndDelete(id).then(result => { //tmb se puede usar findByIdAndRemove

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