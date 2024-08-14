import { PrediccionModel } from "../model/PrediccionModel.js";

export const hacerPrediccionByJornada = async (req, res) => {
    try {
        const { numJornada } = req.params;
        const predicciones = req.body;
        console.log("Numero jornada para prediccion: ", numJornada);
        console.log("Datos de predicción: ", predicciones);

        res.status(201).json({message: 'Predicción guardada correctamente'})
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}