import { MensajeModel } from "../model/MensajeModel.js"

export const getMensajes = async (req, res) => {
    try {
        console.log("Estoy aqui en devolver mensajes");
        
        const mensajes = await MensajeModel.find();
        if(!mensajes) {
            return res.status(404).json({message: 'No hay mensajes todavia'})
        }
        res.status(200).json({mensajes})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}
export const crearMensaje = async (req, res) => {
    try {
        console.log("Contenido: ", req.body);
        const mensaje = await MensajeModel.create(req.body);
        res.status(201).json({message: 'Mensaje enviado correctamente'});
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}