import express from 'express'
import { loginUsuario, registrarUsuario, getUsuariodatos, updateUsuarios, getUsuarios, createUsuarioAdmin, deleteUsuarios } from '../controller/UserController.js'
import { autenticarToken } from "../middleware/authUser.js"

const router = express.Router()

router.post("/registro", registrarUsuario)
router.post("/login", loginUsuario)
router.get("/:id", autenticarToken, getUsuariodatos);
router.put("/:id", autenticarToken, updateUsuarios);
router.get("/", autenticarToken, getUsuarios);
router.post("/create", autenticarToken, createUsuarioAdmin);
router.delete("/:id", autenticarToken, deleteUsuarios)

export default router;