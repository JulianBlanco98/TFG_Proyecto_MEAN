import express from 'express'
import { autenticarToken } from '../middleware/authUser.js'
import { actualizarPrediccionByJornada, deletePrediccionByJornada, getPrediccionByJornada, getPrediccionesHechas, hacerPrediccionByJornada } from '../controller/PrediccionController.js';

const router = express.Router();

//Predición de tipo 1
router.post('/createPredi/:numJornada/:tipoPredi', autenticarToken, hacerPrediccionByJornada);
router.put('/actualizarPredi/:numJornada/:tipoPredi', autenticarToken, actualizarPrediccionByJornada);
router.delete('/borrarPredi/:numJornada/:tipoPredi', autenticarToken, deletePrediccionByJornada);
router.get('/historico', autenticarToken, getPrediccionesHechas);
router.get('/:numJornada', autenticarToken, getPrediccionByJornada);

export default router;