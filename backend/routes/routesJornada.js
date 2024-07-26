import express from 'express'
import { getJornadaActual, getJornadaByNumero, simularJornadaActual } from '../controller/JornadaController.js'
import { autenticarToken } from '../middleware/authUser.js'

const router = express.Router()

router.get('/:numero', getJornadaByNumero)
router.put('/s/simularJornada', autenticarToken, simularJornadaActual)
router.get('/j/actual', autenticarToken, getJornadaActual)

export default router;