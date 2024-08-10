import express from 'express'
import { getJugadoresByEquipo, getJugadoresByPosicion, getGoleadores, getAsistentes, getGolesTotales, getAsistenciasTotales, getJugadorById} from '../controller/JugadorController.js'

const router = express.Router()

router.get('/goleadores', getGoleadores);
router.get('/asistentes', getAsistentes);
router.get('/equipo/:idApi', getJugadoresByEquipo)
router.get('/equipoT/:idApi/:tipo', getJugadoresByPosicion)
router.get('/totalG', getGolesTotales);
router.get('/totalA', getAsistenciasTotales);
router.get('/:id', getJugadorById);

export default router;