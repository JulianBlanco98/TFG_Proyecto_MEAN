import { PremioModel } from "../models/PremioModel.js"
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
export const createPremios = async (req,res) => {
    try {
        const premio = await PremioModel.create(req.body)
        res.status(201).json(premio)        
    } catch (error) {
        res.status(500).json({message: error.message})
    }

}
export const updatePremios = async (req,res) => {
    try {
        const {id} = req.params
        const premio = await PremioModel.findOneAndUpdate(
            {_id: id},
            req.body,
            {new: true}
        )
        res.status(200).json(premio)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
export const deletePremios = async (req,res) => {
    try {
        const {id} = req.params
        const premio = await PremioModel.findByIdAndDelete(id)
        if(!premio){
            return res.status(404).json(`El premio con id: ${id} no se ha encontrado`)
        }
        res.status(200).json("Premio borrado!")
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}