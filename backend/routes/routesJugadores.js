import express from 'express'
import { getJugadoresByEquipo } from '../controller/JugadorController.js'

const router = express.Router()

router.get('/equipo/:idApi', getJugadoresByEquipo)

export default router;