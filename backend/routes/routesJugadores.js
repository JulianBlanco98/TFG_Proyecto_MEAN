import express from 'express'
import { getJugadoresByEquipo } from '../controller/JugadorController.js'

const router = express.Router()

router.get('/equipo/:id', getJugadoresByEquipo)

export default router;