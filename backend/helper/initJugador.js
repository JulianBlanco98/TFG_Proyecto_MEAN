import { recuperarJugadores } from "../controller/JugadorController.js";
import { EquiposModel } from "../model/EquiposModel.js";
import { JugadorModel } from "../model/JugadorModel.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config()
const API_KEY = process.env.API_KEY
const API_URL = 'https://api.football-data.org/v4/competitions/PD/teams'

//Aparte del método de rellenar el 90% de campos de jugadores, faltan 2 campos
//que están en otra llamada a la api diferente.
//Como la api solo me ofrece 10 llamadas por minuto, y son 20 equipos,
//voy a hacer 2 funciones: cada una de ellas tendrá 10 llamadas a la API

/*Athlethic: 77
Atleti: 78
Osasuna: 79
Español: 80
Barça: 81
Getafe: 82
Real Madrid: 86
Rayo Vallecano: 87
Mallorca: 89
Betis: 90
Real Sociedad: 92
Villareal: 94
Valencia: 95
Valladolid: 250
Alavés: 263
LasPalmas: 275
Girona: 298
Celta: 558
Sevilla: 559
Leganés: 745*/




export const verificarJugadores = async() => {
    try {
        const contador = await JugadorModel.countDocuments()
        if(contador === 0){
            console.log("Colección vacía, procediendo a cargar los datos...");
            await recuperarJugadores()
        }
        else{
            console.log('La colección ya contiene datos, no es necesario cargar.');
        }
    } catch (error) {
        console.error("Error al cargar los datos: ",error)
    }
}