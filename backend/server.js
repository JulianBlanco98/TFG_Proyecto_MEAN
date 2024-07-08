import express from 'express';
import dotenv from 'dotenv'
import { connectDB } from './config/db.js';

const app = express()
dotenv.config()

app.get("/", (req, res) =>{
    res.send("Hola mundo")
})

const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

/*app.listen(PORT, () => {
    connectDB(MONGO_URI)
    console.log("¡Conectado a MongoDB!");
    console.log(`Servidor corriendo en la URL http://localhost:${PORT}`);
    })*/
   
   const start = async() => {
       try {
           await connectDB(MONGO_URI)
           console.log("¡Conectado a MongoDB!");
           app.listen(PORT, () => {
               console.log(`Servidor corriendo en la URL http://localhost:${PORT}`);
           })
    } catch (error) {
        console.log(error);
    }
}

start()