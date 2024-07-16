import axios from "axios";
import { EquiposModel } from "../model/EquiposModel.js";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY
const API_URL = 'https://api.football-data.org/v4/competitions/PD/teams'

export const recuperarDatos = async (req, res) => { 
    console.log("API KEY: ", API_KEY);
    try {
        const response = await axios.get(API_URL, {
            headers: {
                'X-Auth-Token': API_KEY
            }
        });

        const datosAPI = response.data.teams //Lista de todos los equipos
        //filtrar los campos que quiero para equipos
        const filtrarDatos = datosAPI.map((team) => ({
            nombreEquipo: team.name,
            nombreEquipoCorto: team.shortName,
            escudoEquipo: team.crest,
            direccionEquipo: team.address,
            webEquipo: team.website,
            anoFundacionEquipo: team.founded,
            coloresEquipos: team.clubColors,
            estadioEquipo: team.venue,
        }));

        // Guardar los datos en la base de datos
        await EquiposModel.insertMany(filtrarDatos);
        
        if (res) {
            res.status(200).send('Datos guardados con éxito');
        } else {
            console.log('Datos guardados con éxito');
        }
    } catch (error) {
        console.error('Error recuperando los datos de la API de equipos', error);
        if (res) {
            res.status(500).send('Error recuperando los datos de la API');
        }
    }
};

export const getEquipos = async (req, res) => {
    try {
        const equipos = await EquiposModel.find()
        res.status(200).json(equipos)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
export const getEquiposOrdenados = async (req, res) => {
    try {
        const equipos = await EquiposModel.find().sort({nombreEquipoCorto: 1})
        res.status(200).json(equipos)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getEquipo = async (req, res) => {
    try {
        const {id} = req.params
        const equipo = await EquiposModel.findById(id)
        if(!equipo){
            return res.status(400).json(`El equipo con id: ${id} no existe en la base de datos`)
        }
        res.status(200).json({equipo})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}