import express from 'express'
import { loginUsuario, registrarUsuario } from '../controller/UserController.js'

const router = express.Router()

router.post("/registro", registrarUsuario)
router.post("/login", loginUsuario)

export default router;