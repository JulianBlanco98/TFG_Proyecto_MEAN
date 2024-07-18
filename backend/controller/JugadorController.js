import axios from "axios";
import { JugadorModel } from "../model/JugadorModel.js";
import { EquiposModel } from "../model/EquiposModel.js";
import dotenv from "dotenv";

dotenv.config()

const API_KEY = process.env.API_KEY
const API_URL = 'https://api.football-data.org/v3/teams'

// Función para formatear la fecha
const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}-${mes}-${año}`;
};

const quitarAcentos = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const getJugadoresByEquipo = async (req, res) => {

    //Lógica de la API aquí con los jugadores del equipo seleccionados
    try {
        console.log("Metodo de buscar jugadores segun el id de la api");
        const {idApi} = req.params //Recojo el idAPI del front
        //Tengo que ver si la colección jugadores, tiene jugadores de este equipo
        console.log("Id de la API del front: ", idApi);
        const jugadoresExistentes = await JugadorModel.find({idApiEquipo: idApi})
        if(jugadoresExistentes.length > 0){
            console.log("Jugadores de este equipo ya incluidos");
            return res.status(200).json({jugadores: jugadoresExistentes})
        }

        //Si no existen, llamo a la API externa, para agregarlos a la base de datos
        const response = await axios.get(`${API_URL}/${idApi}`, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        });
        const jugadoresAPI = response.data.squad
        const equipo = await EquiposModel.findOne({idEquipoAPI: idApi})
        //console.log(jugadoresAPI);
        //console.log("Equipo: ", equipo);

        const coloresEquipo = equipo.coloresEquipos; // "Red / White / Black"
        let arrayColores = coloresEquipo.split(" / "); // ["Red", "White", "Black"]
        arrayColores = arrayColores.map(color => color.toLowerCase()); // ["red", "white", "black"]


        const jugadores = jugadoresAPI.map(jugador => {
            //Esto es para la ruta de las imagenes de los juagdores
            const nombreEquipoFormateado = quitarAcentos(equipo.nombreEquipoCorto).replace(/ /g, '_').toLowerCase();
            const nuevoJugador = {
                idEquipo: equipo._id,
                idApiEquipo: idApi,
                coloresEquipo: arrayColores,
                datos: {
                    nombreJugador: jugador.name,
                    posicion: jugador.position || "Desconocido",
                    fechaNacimiento: formatearFecha(jugador.dateOfBirth),
                    nacionalidad: jugador.nationality || "Desconocido",
                    dorsal: jugador.shirtNumber || -1,
                    paisNacimiento: jugador.countryOfBirth || "Desconocido",
                    imagenJugador: `/assets/img/jugadores/jug_${nombreEquipoFormateado}.png`,                },
            };

            //console.log("Jugador creado:", nuevoJugador); // Log para ver cada jugador creado

            return nuevoJugador;
        });

        //console.log("Este log es justo antes de insertar los jugadores");
        await JugadorModel.insertMany(jugadores)
        console.log("Jugadores añadidos desde la API");
        res.status(200).json({ jugadores });

    } catch (error) {
        console.error('Error al insertar jugadores en la base de datos:', error);
        res.status(500).json({ message: 'Error al insertar jugadores en la base de datos' });
    }
}

export const getPorteros = async (req, res) => {
    try {
        const {idApi} = req.params
        console.log("Consulta de porteros. IDAPI: ",idApi);
        const porteros = await JugadorModel.find({
            idApiEquipo: idApi,
            'datos.posicion': 'Goalkeeper'
        })

        res.status(200).json(porteros)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


