import { ClasificacionModel } from "../model/SimularLiga/ClasificacionModel.js";
import { EquiposModel } from "../model/EquiposModel.js";

export const getTablaClasificacion = async (req, res) => {
    try {
        //console.log("Get Clasificacion");
        const clasificacion = await ClasificacionModel.findOne().sort({_id: -1})
        .populate('tabla.equipoPosicion', 'nombreEquipoCorto escudoEquipo');

        if(!clasificacion){
            return res.status(400).json(`La tabla de clasificacion no está creada`)
        }

        return res.status(200).json(clasificacion);


    } catch (error) {
        res.status(500).json({message: error.message})
    }
}