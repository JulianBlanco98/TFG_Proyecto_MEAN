import axios from "axios";
import { JugadorModel } from "../model/JugadorModel";
import { EquiposModel } from "../model/EquiposModel";
import dotenv from "dotenv";

dotenv.config()

const API_KEY = process.env.API_KEY
const API_URL = 'https://api.football-data.org/v4/competitions/PD/teams'

/*export const recuperarJugadores = async (req, res) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        });

        const datosAPI = response.data.teams

        const filtrarDatos = datosAPI.map((team)) => ({

        });
    } catch (error) {
        console.error('Error recuperando los datos de la API de equipos', error);
        if (res) {
            res.status(500).send('Error recuperando los datos de la API');
        }
    }
}*/

