import express from 'express'
import { getJugadoresByEquipo, getJugadoresByPosicion, getGoleadores, getAsistentes} from '../controller/JugadorController.js'

const router = express.Router()

router.get('/equipo/:idApi', getJugadoresByEquipo)
router.get('/equipoT/:idApi/:tipo', getJugadoresByPosicion)
router.get('/goleadores', getGoleadores);
router.get('/asistentes', getAsistentes);
export default router;