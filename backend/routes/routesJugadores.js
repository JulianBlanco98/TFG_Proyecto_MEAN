import express from 'express'
import { getJugadoresByEquipo, getJugadoresByPosicion} from '../controller/JugadorController.js'

const router = express.Router()

router.get('/equipo/:idApi', getJugadoresByEquipo)
router.get('/equipoT/:idApi/:tipo', getJugadoresByPosicion)
export default router;