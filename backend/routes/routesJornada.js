import express from 'express'
import { getJornadaByNumero } from '../controller/JornadaController.js'

const router = express.Router()

router.get('/:numero', getJornadaByNumero)

export default router;