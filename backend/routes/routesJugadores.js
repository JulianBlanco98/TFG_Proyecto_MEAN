import express from 'express'
import { getJugadoresByEquipo, getJugadoresByPosicion, getGoleadores} from '../controller/JugadorController.js'

const router = express.Router()

router.get('/equipo/:idApi', getJugadoresByEquipo)
router.get('/equipoT/:idApi/:tipo', getJugadoresByPosicion)
router.get('/goleadores', getGoleadores);
export default router;