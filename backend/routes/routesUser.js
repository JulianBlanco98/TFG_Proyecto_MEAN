import express from 'express'
import { loginUsuario, registrarUsuario, getUsuariodatos, updateUsuarios } from '../controller/UserController.js'
import { autenticarToken } from "../middleware/authUser.js"

const router = express.Router()

router.post("/registro", registrarUsuario)
router.post("/login", loginUsuario)
router.get("/:id", autenticarToken, getUsuariodatos);
router.put("/:id", autenticarToken, updateUsuarios);

export default router;