import express from 'express'
import { autenticarToken } from "../middleware/authUser.js"
import { crearMensaje, getMensajes } from '../controller/MensajeController.js'

const router = express.Router()

router.get("/", autenticarToken, getMensajes)
router.post("/", autenticarToken, crearMensaje)

export default router