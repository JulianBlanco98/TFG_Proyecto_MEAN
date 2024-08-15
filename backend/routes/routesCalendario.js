import express from 'express';
import { autenticarToken } from '../middleware/authUser.js';
import { resetearCalendario } from '../controller/CalendarioController.js';

const router = express.Router();

router.post('/resetearCalendario', autenticarToken, resetearCalendario);

export default router;