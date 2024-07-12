import express from 'express'
import { getUsuario, getUsuarios, createUsuarios, updateUsuarios, deleteUsuarios } from '../controller/UsuarioController.js' 

const router = express.Router()


//Forma más clara
router.get("/", getUsuarios)
router.get("/:id", getUsuario)
router.post("/", createUsuarios)
router.put(":id", updateUsuarios)
router.delete(":id", deleteUsuarios)

//Forma más precisa
/*
router.route("/").get(getUsuarios).post(createUsuarios)
router.route("/:id").get(getUsuario).put(updateUsuarios).delete(deleteUsuarios)
*/

export default router