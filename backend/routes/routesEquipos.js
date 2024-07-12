import express from 'express';
import { getEquipos, getEquiposOrdenados } from '../controller/EquipoController.js';

const router = express.Router();

router.get('/', getEquipos);
router.get('/ord', getEquiposOrdenados)

export default router;