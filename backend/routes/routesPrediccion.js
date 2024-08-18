import express from 'express'
import { autenticarToken } from '../middleware/authUser.js'
import { actualizarPrediccionByJornada, createPrediTipo2, deletePrediccionByJornada, getPrediccionByJornada, hacerPrediccionByJornada } from '../controller/PrediccionController.js';

const router = express.Router();

//Predición de tipo 1
router.post('/createPredi/:numJornada/:tipoPredi', autenticarToken, hacerPrediccionByJornada);
router.put('/actualizarPredi/:numJornada/:tipoPredi', autenticarToken, actualizarPrediccionByJornada);
router.delete('/borrarPredi/:numJornada/:tipoPredi', autenticarToken, deletePrediccionByJornada);
router.get('/:numJornada', autenticarToken, getPrediccionByJornada);

//Predicción de tipo2
router.post('/tipo_2/createPredi/:numJornada', autenticarToken, createPrediTipo2);


export default router;