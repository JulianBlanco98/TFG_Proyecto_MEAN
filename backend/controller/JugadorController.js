import axios from "axios";
import { JugadorModel } from "../model/JugadorModel.js";
import { EquiposModel } from "../model/EquiposModel.js";
import dotenv from "dotenv";

dotenv.config()

const API_KEY = process.env.API_KEY
const API_URL = 'https://api.football-data.org/v4/competitions/PD/teams'

// Función para formatear la fecha
const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}-${mes}-${año}`;
};


export const recuperarJugadores = async (req, res) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        });
        const datosAPI = response.data.teams

        let i = 0;

        for (const team of datosAPI) {
            console.log(`Tamaño del equipo ${team.shortName}: ${team.squad.length}`);
            const equipoColeccion = await EquiposModel.findOne({nombreEquipoCorto: team.shortName});
            const id_Equipo = equipoColeccion._id;
            let contador = 0;
            const promises = team.squad.map(async (jugador) => {
                const nuevoJugador = {
                    idEquipo: id_Equipo,
                    nombreEquipo: team.shortName,
                    datos: {
                        nombreJugador: jugador.name,
                        posicion: jugador.position,
                        fechaNacimiento: formatearFecha(jugador.dateOfBirth),
                        nacionalidad: jugador.nationality,
                    },
                    estadisticas: null, //la colección estadísticas la crearé después
                };

                await JugadorModel.create(nuevoJugador);
                contador++;
            });
            await Promise.all(promises);
            console.log("Equipo "+team.shortName+" --> Numero de jugadores: ",contador);
            i++;
        }
        if (res) {
            res.status(200).send('Datos de jugadores guardados correctamente');
        } else {
            console.log('Datos de jugadores guardados correctamente');
        }
        
    } catch (error) {
        console.error('Error recuperando los datos de la API de equipos', error);
        if (res) {
            res.status(500).send('Error recuperando los datos de la API');
        }
    }
}

export const getJugadoresByEquipo = async (req, res) => {
    try {
        const {id} = req.params
        const jugadores = await JugadorModel.find({idEquipo: id})
        if(!jugadores){
            return res.status(400).json(`Este id: ${id} no existe de equipo`)
        }
        //dconsole.log("Numero de jugadores: ",jugadores.length);
        res.status(200).json({jugadores})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


