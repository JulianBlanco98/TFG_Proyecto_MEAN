import axios from "axios";
import { JugadorModel } from "../model/JugadorModel.js";
import { EquiposModel } from "../model/EquiposModel.js";
import { EntrenadorModel } from "../model/EntrenadorModel.js";
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

// Función para crear jugadores
const crearJugadores = async (jugadoresAPI, equipo, idApi, arrayColors) => {
    return jugadoresAPI.map(jugador => {
        const nombreEquipoFormateado = quitarAcentos(equipo.nombreEquipoCorto).replace(/ /g, '_').toLowerCase();
        const nuevoJugador = {
            idEquipo: equipo._id,
            idApiEquipo: idApi,
            coloresEquipo: arrayColors,
            datos: {
                nombreJugador: jugador.name,
                posicion: jugador.position || "Desconocido",
                fechaNacimiento: formatearFecha(jugador.dateOfBirth),
                nacionalidad: jugador.nationality || "Desconocido",
                dorsal: jugador.shirtNumber || -1,
                paisNacimiento: jugador.countryOfBirth || "Desconocido",
                imagenJugador: `/assets/img/jugadores/jug_${nombreEquipoFormateado}.png`,
            },
        };
        return nuevoJugador;
    });
};

// Función para crear entrenadores
const crearEntrenadores = async (entrenadoresAPI, equipo, idApi, arrayColors) => {
    return entrenadoresAPI.map(entrenador => {
        const nombreEquipoFormateado = quitarAcentos(equipo.nombreEquipoCorto).replace(/ /g, '_').toLowerCase();
        const nuevoEntrenador = {
            idEquipo: equipo._id,
            idApiEquipo: idApi,
            coloresEquipo: arrayColors,
            datos: {
                nombreEntrenador: entrenador.name,
                fechaNacimiento: formatearFecha(entrenador.dateOfBirth),
                nacionalidad: entrenador.nationality || "Desconocido",
                paisNacimiento: entrenador.countryOfBirth || "Desconocido",
                imagenEntrenador: `/assets/img/entrenadores/ent_${nombreEquipoFormateado}.png`,
            },
        };
        return nuevoEntrenador;
    });
};

export const getJugadoresByEquipo = async (req, res) => {
    try {
        const {idApi} = req.params;
        const jugadoresExistentes = await JugadorModel.find({idApiEquipo: idApi});
        const entrenadorExistente = await EntrenadorModel.find({idApiEquipo: idApi});
        if(jugadoresExistentes.length > 0 && entrenadorExistente.length > 0){
            console.log("Jugadores y entrenador ya creados --> No se llama a la API");
            return res.status(200).json({jugadores: jugadoresExistentes, entrenador: entrenadorExistente});
        }

        const response = await axios.get(`${API_URL}/${idApi}`, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        });
        let jugadoresAPI = response.data.squad;
        const equipo = await EquiposModel.findOne({idEquipoAPI: idApi});
        let arrayColores = equipo.coloresEquipos.split(" / ").map(color => color.toLowerCase());

        let jugadores = [];
        let entrenadores = [];

        if(jugadoresExistentes.length === 0){
            const jugadoresAPICopy = [...jugadoresAPI]; // Creo una copia de jugadoresAPI para poder añadir el entrenador si no está
            const jugadoresFiltrados = jugadoresAPICopy.filter(jug => jug.role === 'PLAYER');
            jugadores = await crearJugadores(jugadoresFiltrados, equipo, idApi, arrayColores);
            console.log("Añadiendo los jugadores.....");
            await JugadorModel.insertMany(jugadores);
        }

        if(entrenadorExistente.length === 0){
            const entrenadoresAPICopy = [...jugadoresAPI]; // Creo una copia de jugadoresAPI
            const entrenadoresFiltrados = entrenadoresAPICopy.filter(ent => ent.role === 'COACH');
            entrenadores = await crearEntrenadores(entrenadoresFiltrados, equipo, idApi, arrayColores);
            console.log("Añadiendo el entrenador.....");
            await EntrenadorModel.insertMany(entrenadores);
        }

        res.status(200).json({jugadores: jugadores.length > 0 ? jugadores : jugadoresExistentes, entrenador: entrenadores.length > 0 ? entrenadores : entrenadorExistente});
    } catch (error) {
        console.error('Error al insertar jugadores y entrenadores en la base de datos:', error);
        res.status(500).json({ message: 'Error al insertar jugadores y entrenadores en la base de datos' });
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


