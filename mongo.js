const mongoose = require('mongoose')

const connectionString = 'mongodb+srv://juanma:clave13@cluster0.wtfzhrt.mongodb.net/biblioteca?retryWrites=true&w=majority'

//algunas cosas deprecated
mongoose.set('strictQuery', false)

//conexion a mongoDb
mongoose
    .connect(connectionString)
    .then(() => console.log('database connected'))
    .catch((err) => console.log(err))
