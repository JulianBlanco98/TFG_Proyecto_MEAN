import express from 'express'
import { autenticarToken } from '../middleware/authUser.js'
import { getPrediccionByJornada, hacerPrediccionByJornada } from '../controller/PrediccionController.js';

const router = express.Router();

router.post('/createPredi/:numJornada', autenticarToken, hacerPrediccionByJornada);
router.get('/:numJornada', autenticarToken, getPrediccionByJornada);

export default router;