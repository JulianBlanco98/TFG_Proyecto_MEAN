import express from 'express'
import { autenticarToken } from '../middleware/authUser.js'
import { actualizarPrediccionByJornada, createPrediTipo2, deletePrediccionByJornada, getPrediccionByJornada, hacerPrediccionByJornada } from '../controller/PrediccionController.js';

const router = express.Router();

//Predición de tipo 1
router.post('/tipo_1/createPredi/:numJornada', autenticarToken, hacerPrediccionByJornada);
router.put('/tipo_1/actualizarPredi/:numJornada', autenticarToken, actualizarPrediccionByJornada);
router.delete('/tipo_1/borrarPredi/:numJornada', autenticarToken, deletePrediccionByJornada);
router.get('/tipo_1/:numJornada', autenticarToken, getPrediccionByJornada);

//Predicción de tipo2
router.post('/tipo_2/createPredi/:numJornada', autenticarToken, createPrediTipo2);


export default router;