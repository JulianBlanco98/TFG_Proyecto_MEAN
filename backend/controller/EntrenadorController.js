import { EntrenadorModel } from "../model/EntrenadorModel";

export const getEntrenadorByIdEquipo = async (req, res) => {
    
    try {
        const {idApi} = req.params
        const entrenador = await EntrenadorModel.find({idApiEquipo: idApi})

        res.status(200).json(entrenador)
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}