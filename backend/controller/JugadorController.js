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

/*const imagenesEquipos = {
    77: "/assets/img/jugadores/jug_bilbao.png",
    78: "/assets/img/jugadores/jug_atleti.png",
    79: "/assets/img/jugadores/jug_osasuna.png",
    80: "/assets/img/jugadores/jug_espanyol.png",
    81: "/assets/img/jugadores/jug_barsa.png",
    82: "/assets/img/jugadores/jug_getafe.png",
    86: "/assets/img/jugadores/jug_madrid.png",
    87: "/assets/img/jugadores/jug_vallecano.png",
    89: "/assets/img/jugadores/jug_mallorca.png",
    90: "/assets/img/jugadores/jug_betis.png",
    92: "/assets/img/jugadores/jug_sociedad.png",
    94: "/assets/img/jugadores/jug_villareal.png",
    95: "/assets/img/jugadores/jug_valencia.png",
    250: "/assets/img/jugadores/jug_valladolid.png",
    263: "/assets/img/jugadores/jug_alaves.png",
    275: "/assets/img/jugadores/jug_laspalmas.png",
    298: "/assets/img/jugadores/jug_girona.png",
    558: "/assets/img/jugadores/jug_celta.png",
    559: "/assets/img/jugadores/jug_sevilla.png",
    745: "/assets/img/jugadores/jug_leganes.png",
};*/

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

        const jugadores = jugadoresAPI.map(jugador => {
            //Esto es para la ruta de las imagenes de los juagdores
            const nombreEquipoFormateado = quitarAcentos(equipo.nombreEquipoCorto).replace(/ /g, '_').toLowerCase();
            const nuevoJugador = {
                idEquipo: equipo._id,
                idApiEquipo: idApi,
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


