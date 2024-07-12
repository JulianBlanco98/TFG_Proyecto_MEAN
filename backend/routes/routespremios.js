import express from 'express'
import { getPremio, getPremios, createPremios, updatePremios, deletePremios } from '../controllers/PremioController.js'

const router = express.Router()

router.get("/", getPremios)
router.get("/:id", getPremio)
router.post("/", createPremios)
router.put("/:id", updatePremios)
router.delete("/:id", deletePremios)

export default router