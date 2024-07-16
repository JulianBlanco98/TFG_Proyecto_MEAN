import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from 'cors'
import { connectDB } from "./config/db.js";
import routerUsuarios from "./routes/routesUsuarios.js";
import routerPremios from "./routes/routesPremios.js";
import routerEquipos from "./routes/routesEquipos.js"
import routerJugadores from "./routes/routesJugadores.js"

//Carga de la colección de equipos
import { verificarCargaDatos } from "./helper/initEquipo.js";
import { verificarJugadores } from "./helper/initJugador.js";


const app = express();
dotenv.config();

app.use(express.json());
app.use(cors())
app.use(urlencoded({ extended: true }));

//Endpoints de las colecciones de la base de datos
//Aquí son las rutas con las que luego se recoge en el front y en insomnia
app.use("/apiTFG/usuarios", routerUsuarios);
app.use("/apiTFG/premios", routerPremios);
app.use("/apiTFG/equipos", routerEquipos)
app.use("/apiTFG/jugadores", routerJugadores)

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

/*app.listen(PORT, () => {
    connectDB(MONGO_URI)
    console.log("¡Conectado a MongoDB!");
    console.log(`Servidor corriendo en la URL http://localhost:${PORT}`);
    })*/

const start = async () => {
    try {
        console.log("Iniciando el servidor...");
        await connectDB(MONGO_URI);
        console.log("¡Conectado a MongoDB!");

        //Verificar los datos de equipo
        await verificarCargaDatos();

        //Verificar los jugadores (no estadísticas todavía)
        await verificarJugadores();

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en la URL http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
