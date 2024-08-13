import { PrediccionModel } from "../model/PrediccionModel.js";

export const hacerPrediccionByJornada = async (req, res) => {
    try {
        const {numJornada} = req.params;
        console.log("Numero jornada para prediccion: ", numJornada);
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}