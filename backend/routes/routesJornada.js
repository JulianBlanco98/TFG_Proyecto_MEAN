import express from 'express'
import { getAsistenteJornadaActual, getGoleadorJornadaActual, getJornadaActual, getJornadaByNumero, simularJornadaActual } from '../controller/JornadaController.js'
import { autenticarToken } from '../middleware/authUser.js'

const router = express.Router()

router.put('/s/simularJornada', autenticarToken, simularJornadaActual)
router.get('/j/actual', getJornadaActual)
router.get('/goleadorJornada', getGoleadorJornadaActual)
router.get('/asistenteJornada', getAsistenteJornadaActual)
router.get('/:numero', getJornadaByNumero)

export default router;