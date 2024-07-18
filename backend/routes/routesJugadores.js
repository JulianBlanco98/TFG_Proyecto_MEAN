import express from 'express'
import { getJugadoresByEquipo, getPorteros } from '../controller/JugadorController.js'

const router = express.Router()

router.get('/equipo/:idApi', getJugadoresByEquipo)
router.get('/equipo/:idApi/porteros', getPorteros)

export default router;