import { EquiposModel } from "../model/EquiposModel.js";
import { JugadorModel } from "../model/JugadorModel.js";

export const verificarJugadores = async() => {
    try {
        const contador = await JugadorModel.countDocuments()
        if(contador === 0){
            console.log("Colección vacía, procediendo a cargar los datos...");
            //await recuperarDatos()
        }
        else{
            console.log('La colección ya contiene datos, no es necesario cargar.');
        }
    } catch (error) {
        console.error("Error al cargar los datos: ",error)
    }
}