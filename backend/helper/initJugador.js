import { recuperarJugadores } from "../controller/JugadorController.js";
import { JugadorModel } from "../model/JugadorModel.js";

/*Athlethic: 77
Atleti: 78
Osasuna: 79
Español: 80
Barça: 81
Getafe: 82
Real Madrid: 86
Rayo Vallecano: 87
Mallorca: 89
Betis: 90
Real Sociedad: 92
Villareal: 94
Valencia: 95
Valladolid: 250
Alavés: 263
LasPalmas: 275
Girona: 298
Celta: 558
Sevilla: 559
Leganés: 745*/




export const verificarJugadores = async() => {
    try {
        const contador = await JugadorModel.countDocuments()
        if(contador === 0){
            console.log("Colección vacía, procediendo a cargar los datos...");
            await recuperarJugadores()
        }
        else{
            console.log('La colección ya contiene datos, no es necesario cargar.');
        }
    } catch (error) {
        console.error("Error al cargar los datos: ",error)
    }
}