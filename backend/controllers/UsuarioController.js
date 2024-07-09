import { UsuarioModel } from "../models/UsuarioModel.js";

export const getUsuarios = async (req,res) => {
    try {
        const usuarios = await UsuarioModel.find()
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
export const getUsuario = async (req,res) => {
    try {
        const {id} = req.params
        const usuario = await UsuarioModel.findById(id)
        if(!usuario){
            return res.status(404).json(`El usuario con id: ${id} no se ha encontrado`)
        }
        res.status(200).json({usuario})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
export const createUsuarios = async (req,res) => {
    try {
        const usuario = await UsuarioModel.create(req.body)
        res.status(201).json(usuario)        
    } catch (error) {
        res.status(500).json({message: error.message})
    }

}
export const updateUsuarios = async (req,res) => {
    try {
        const {id} = req.params
        const usuario = await UsuarioModel.findOneAndUpdate(
            {_id: id},
            req.body,
            {new: true}
        )
        res.status(200).json(usuario)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
export const deleteUsuarios = async (req,res) => {
    try {
        const {id} = req.params
        const usuario = await UsuarioModel.findByIdAndDelete(id)
        if(!usuario){
            return res.status(404).json(`El usuario con id: ${id} no se ha encontrado`)
        }
        res.status(200).json("Usuario borrado!")
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}