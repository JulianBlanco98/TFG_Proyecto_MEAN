import express from 'express'
import { getPremio, getPremios, createPremios, updatePremios, deletePremios, canjearPremio } from '../controller/PremioController.js'
import { autenticarToken } from "../middleware/authUser.js"

const router = express.Router()

router.get("/", getPremios)
router.get("/:id", getPremio)
router.post("/", createPremios)
router.put("/:id", updatePremios)
router.delete("/:id", deletePremios)
router.get('/canjearPremio/:idPremio', autenticarToken, canjearPremio)

export default router