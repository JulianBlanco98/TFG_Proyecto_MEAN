import express from 'express'
import { getJornadaByNumero, simularJornadaActual } from '../controller/JornadaController.js'
import { autenticarToken } from '../middleware/authUser.js'

const router = express.Router()

router.get('/:numero', getJornadaByNumero)
router.put('/simularJornada', autenticarToken, simularJornadaActual)

export default router;