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


/*export const recuperarJugadores = async (req, res) => {
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
                        posicion: jugador.position || "Desconocido",
                        fechaNacimiento: formatearFecha(jugador.dateOfBirth),
                        nacionalidad: jugador.nationality,
                    },
                    estadisticas: null, //la colección estadísticas la crearé después
                };

                await JugadorModel.create(nuevoJugador);
                contador++;
                i++;
            });
            await Promise.all(promises);
            console.log("Equipo "+team.shortName+" --> Numero de jugadores: ",contador);
        }
        if (res) {
            res.status(200).send('Datos de jugadores guardados correctamente');
        } else {
            console.log("Total de jugadores: ",i)
            console.log('Datos de jugadores guardados correctamente');
        }
        
    } catch (error) {
        console.error('Error recuperando los datos de la API de equipos', error);
        if (res) {
            res.status(500).send('Error recuperando los datos de la API');
        }
    }
}*/



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
                },
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


