import express from 'express';
import { getMultiplicadorTipo1, getTablaClasificacion } from '../controller/ClasificacionController.js';

const router = express.Router()

router.get('/clasificacion', getTablaClasificacion);
router.get('/multi', getMultiplicadorTipo1);

export default router;