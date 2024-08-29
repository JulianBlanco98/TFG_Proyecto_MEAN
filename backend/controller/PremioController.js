import { PremioModel } from "../model/PremioModel.js"
import { UserModel } from "../model/UserModel.js"
import { premioCanjear } from "../helper/sendCorreo.js";
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const createPremios = async (req, res) => {
    console.log("Entra en createPremios");
    
    try {
        // console.log("Headers: ", req.headers);
        console.log("datos: ", req.body);
        console.log("archivo: ", req.file); // Verifica `req.file`
        
        const { nombrePremio, saldo } = req.body;
        const filePath = `/assets/img/premios/${req.file.filename}`;  // Ruta relativa para frontend

        const nuevoPremio = {
            nombrePremio: nombrePremio,
            imagenPremio: filePath,  // Guardar la ruta en la base de datos
            saldoPremio: saldo
        };

        const premio = await PremioModel.create(nuevoPremio);
        res.status(201).json({ message: 'Premio creado con éxito', premio: premio });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export const deletePremios = async (req,res) => {
    try {
        const {idPremio} = req.params
        const premio = await PremioModel.findById(idPremio)
        if(!premio){
            return res.status(404).json(`El premio con id: ${idPremio} no se ha encontrado`)
        }
        console.log("Estoy en deletePremios antes de imagenPath. Premio: ",premio);
        
        const imagenPath = path.join(__dirname, '../../frontend/src', premio.imagenPremio);
        console.log("En delete. ruta de la imagen: ",imagenPath);
        
        // Eliminar la imagen del sistema de archivos
        try {
            await fs.unlink(imagenPath);
            console.log("Imagen eliminada exitosamente");
        } catch (err) {
            console.error("Error al eliminar la imagen: ", err);
            return res.status(500).json({ message: 'Error al eliminar la imagen' });
        }

        await PremioModel.findByIdAndDelete(idPremio);


        res.status(200).json({message:  'Premio borrado con éxito!'})
    } catch (error) {
        console.log(error);
        
        res.status(500).json({message: error.message})
    }
}
export const updatePremios = async (req,res) => {
    try {
        const {idPremio} = req.params
        const premioExistente = await PremioModel.findById(idPremio);
        if(!premioExistente) {
            return res.status(404).json({ message: `El premio con id: ${idPremio} no se ha encontrado` });
        }

        if(req.file) {
            const imagenAntiguaPath = path.join(__dirname, '../../frontend/src', premioExistente.imagenPremio);
            //Ahora, tengo que eliminar la imagen antigua
            try {
                await fs.unlink(imagenAntiguaPath);
                console.log('Imagen borrada');
                
            } catch (err) {
                console.error("Error al eliminar la imagen antigua: ", err);
                return res.status(500).json({ message: 'Error al eliminar la imagen antigua' });
            }

            //Actualizp la ruta de la imagen nueva
            req.body.imagenPremio = `/assets/img/premios/${req.file.filename}`;
        } else{
            req.body.imagenPremio = premioExistente.imagenPremio;
        }

        console.log("Body: ", req.body);

        let nuevosDatosPremio = {
            'nombrePremio': req.body.nombrePremio,
            'imagenPremio': req.body.imagenPremio,
            'saldoPremio': req.body.saldo
        }
        
        const premioActualizado = await PremioModel.findByIdAndUpdate(
            idPremio,
            nuevosDatosPremio,
            { new: true }
        );

        res.status(200).json({ message: "Premio actualizado con éxito", premio: premioActualizado });
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
export const getPremios = async (req,res) => {
    try {
        const premios = await PremioModel.find()
        res.status(200).json(premios)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
export const getPremio = async (req,res) => {
    try {
        const {id} = req.params
        const premio = await PremioModel.findById(id)
        if(!premio){
            return res.status(404).json(`El premio con id: ${id} no se ha encontrado`)
        }
        res.status(200).json({premio})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
export const canjearPremio = async (req, res) => {
    try {
        console.log("Estoy en canjear premio");
        
        const {idPremio} = req.params;
        const usuario = await UserModel.findById(req.usuario.id);
        if(!usuario) {
            return res.status(404).json({message: 'Usuario no encontrado'})
        }
        const premio = await PremioModel.findById(idPremio);
        if(!premio) {
            return res.status(404).json({message: 'Premio no encontrado'})
        }
        
        console.log("usuario: ",usuario);
        console.log("premio: ",premio);

        if(usuario.moneda < premio.saldoPremio) {
            res.status(400).json({message: 'No tienes suficientes monedas para canjear este premio'})
        }
        else{

            await premioCanjear(usuario, premio);
    
            //Restar las monedas del premio al usuario
            usuario.moneda = usuario.moneda - premio.saldoPremio;
            await usuario.save();
    
            res.status(200).json({message: `El premio ha sido canjeado correctamente. En tu correo ${usuario.datos.nombre}, tienes el código del producto para canjearlo.`})
        }
        
        

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}