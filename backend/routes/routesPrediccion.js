import express from 'express'
import { autenticarToken } from '../middleware/authUser.js'
import { actualizarPrediccionByJornada, deletePrediccionByJornada, getPrediccionByJornada, hacerPrediccionByJornada } from '../controller/PrediccionController.js';

const router = express.Router();

router.post('/createPredi/:numJornada', autenticarToken, hacerPrediccionByJornada);
router.put('/actualizarPredi/:numJornada', autenticarToken, actualizarPrediccionByJornada);
router.delete('/borrarPredi/:numJornada', autenticarToken, deletePrediccionByJornada);
router.get('/:numJornada', autenticarToken, getPrediccionByJornada);

export default router;