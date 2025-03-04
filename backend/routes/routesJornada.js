import express from 'express'
import { getAlineacionPartido, getAsistenteJornadaActual, getEquipoGoleador, getGoleadorJornadaActual, getJornadaActual, getJornadaByNumero, getJornadaNovedades, simularJornadaActual } from '../controller/JornadaController.js'
import { autenticarToken } from '../middleware/authUser.js'

const router = express.Router()

router.put('/s/simularJornada', autenticarToken, simularJornadaActual)
router.get('/j/actual', getJornadaActual)
router.get('/j/novedades', getJornadaNovedades)
router.get('/goleadorJornada', getGoleadorJornadaActual)
router.get('/asistenteJornada', getAsistenteJornadaActual)
router.get('/equipoJornada', getEquipoGoleador)
router.get('/:numero', getJornadaByNumero)
router.get('/partido/:numJornada/:numPartido', getAlineacionPartido);

export default router;