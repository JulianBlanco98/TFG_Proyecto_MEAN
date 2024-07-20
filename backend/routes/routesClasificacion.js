import express from 'express';
import { getTablaClasificacion } from '../controller/ClasificacionController.js';

const router = express.Router()

router.get('/', getTablaClasificacion);

export default router;