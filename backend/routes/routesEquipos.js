import express from 'express';
import { getEquipos, getEquiposOrdenados, getEquipo } from '../controller/EquipoController.js';

const router = express.Router();

router.get('/', getEquipos);
router.get('/ord', getEquiposOrdenados)
router.get('/:id', getEquipo)

export default router;