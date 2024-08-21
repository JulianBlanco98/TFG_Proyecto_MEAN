import { EstadisticasModel } from "../model/EstadisticaModel.js";
import { JugadorModel } from "../model/JugadorModel.js";

export const getEstadisticasByIdJuagdor = async (req, res) => {
    try {
        const {idJugador} = req.params;
        const jugador = await JugadorModel.findById(idJugador).populate('estadisticas');
        if(!jugador) {
            return res.status(404).json({message: 'Jugador no encontrado'})
        }

        res.status(200).json(jugador.estadisticas);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}