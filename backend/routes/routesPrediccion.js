import express from 'express'
import { autenticarToken } from '../middleware/authUser.js'
import { hacerPrediccionByJornada } from '../controller/PrediccionController.js';

const router = express.Router();

router.post('/createPredi/:numJornada', autenticarToken, hacerPrediccionByJornada);

export default router;