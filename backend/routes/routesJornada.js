import express from 'express'
import { getGoleadorJornadaActual, getJornadaActual, getJornadaByNumero, simularJornadaActual } from '../controller/JornadaController.js'
import { autenticarToken } from '../middleware/authUser.js'

const router = express.Router()

router.put('/s/simularJornada', autenticarToken, simularJornadaActual)
router.get('/j/actual', autenticarToken, getJornadaActual)
router.get('/goleadorJornada', getGoleadorJornadaActual)
router.get('/:numero', getJornadaByNumero)

export default router;