import express from 'express'
import { getPremio, getPremios, createPremios, updatePremios, deletePremios, canjearPremio } from '../controller/PremioController.js'
import { autenticarToken } from "../middleware/authUser.js"
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

//Directorio de imagenes de premios
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../frontend/src/assets/img/premios/'));
    },
    filename: (req, file, cb) => {
        // Obtener el nombre del archivo original sin la extensión
    const originalName = path.basename(file.originalname, path.extname(file.originalname));
    // Obtener la extensión del archivo
    const ext = path.extname(file.originalname);
    // Construir el nuevo nombre de archivo
    const newFilename = `premio_${Date.now()}_${originalName}${ext}`;
    cb(null, newFilename);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const router = express.Router()

router.post("/", autenticarToken, upload.single('imagenPremio'), createPremios)
router.get("/", getPremios)
router.get("/:id", getPremio)
router.put("/:idPremio", autenticarToken, upload.single('imagenPremio'), updatePremios)
router.delete("/:idPremio", autenticarToken, deletePremios)
router.get('/canjearPremio/:idPremio', autenticarToken, canjearPremio)

export default router