import express from 'express'
import { getEstadisticasByIdJuagdor } from '../controller/EstadisticasController.js';

const router = express.Router()

router.get('/:idJugador', getEstadisticasByIdJuagdor)

export default router;