import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from 'cors'
import { connectDB } from "./config/db.js";

//Importar las rutas de los endpoint
import routerUsuarios from "./routes/routesUsuarios.js";
import routerPremios from "./routes/routesPremios.js";
import routerEquipos from "./routes/routesEquipos.js"
import routerJugadores from "./routes/routesJugadores.js"
import routerJornadas from "./routes/routesJornada.js"
import routerClasificacion from "./routes/routesClasificacion.js"
import routerPrediccion from "./routes/routesPrediccion.js"
import routerCalendario from "./routes/routesCalendario.js"
import routerEstadistica from "./routes/routesEstadisticas.js"

//Usuarios rutas
import routerUser from "./routes/routesUser.js"

//Carga de la colección de equipos
import { verificarCargaDatos } from "./helper/initEquipo.js";
import { generarCalendario } from "./helper/initCalendario.js";
import { generarTablaClasificacion } from "./helper/initClasificacion.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors())
app.use(urlencoded({ extended: true }));

//Endpoints de las colecciones de la base de datos
//Aquí son las rutas con las que luego se recoge en el front y en insomnia
app.use("/apiTFG/usuarios", routerUsuarios);
app.use("/apiTFG/users", routerUser);
app.use("/apiTFG/premios", routerPremios);
app.use("/apiTFG/equipos", routerEquipos)
app.use("/apiTFG/jugadores", routerJugadores)
app.use("/apiTFG/jornada", routerJornadas)
app.use("/apiTFG/clasificacion", routerClasificacion)
app.use("/apiTFG/prediccion", routerPrediccion)
app.use("/apiTFG/calendario", routerCalendario)
app.use("/apiTFG/estadisticas", routerEstadistica)

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;


const start = async () => {
    try {
        console.log("Iniciando el servidor...");
        await connectDB(MONGO_URI);
        console.log("¡Conectado a MongoDB!");

        //Verificar los datos de equipo
        await verificarCargaDatos();

        //Crear el calendario y las jornadas una vez que estén los equipos
        await generarCalendario();

        //Crear la tabla de clasificacion con los 20 equipos
        await generarTablaClasificacion()

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en la URL http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
