import { JornadaModel } from "../model/SimularLiga/JornadaModel.js";
import { EquiposModel } from "../model/EquiposModel.js";


export const getJornadaByNumero = async (req,res) => {

    try {
        const {numero} = req.params
        console.log("Parametro del numero de jornada: ", numero);
        const jornada = await JornadaModel.findOne({numeroJornada: numero})
        .populate('partidos.equipoLocal', 'nombreEquipoCorto escudoEquipo')
        .populate('partidos.equipoVisitante', 'nombreEquipoCorto escudoEquipo');

        if(!jornada){
            return res.status(400).json(`Esta jornada no existe`)
        }

        return res.status(200).json(jornada)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}