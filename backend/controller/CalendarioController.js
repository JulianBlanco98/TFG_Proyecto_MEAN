import { generarCalendario } from "../helper/initCalendario.js";
import { generarTablaClasificacion } from "../helper/initClasificacion.js";
import { EstadisticasModel } from "../model/EstadisticaModel.js";
import { PrediccionModel } from "../model/PrediccionModel.js";
import { CalendarioModel } from "../model/SimularLiga/CalendarioModel.js";
import { ClasificacionModel } from "../model/SimularLiga/ClasificacionModel.js";
import { JornadaModel } from "../model/SimularLiga/JornadaModel.js";
import { UserModel } from "../model/UserModel.js";

export const resetearCalendario = async (req, res) => {
    try {
        console.log("metodo de resetear calendarios");
        
        //Paso 1 --> Borrar todas las predicciones de todos los usuarios
        await PrediccionModel.deleteMany({});

        //Paso 1.1 --> Devolver las monedas a los usuarios, y reestablecerlos al default (1000 monedas)
        const usuarios = await UserModel.find();
        if(!usuarios){
            return res.status(404).json({message: 'No hay usuarios registrados'})
        }
        await UserModel.updateMany({}, {moneda: 1000});

        //Paso 2 --> Borrar las 38 jornadas
        await JornadaModel.deleteMany({})

        //Paso 3 --> Borrar las clasificaciones
        await ClasificacionModel.deleteMany({})

        //Paso 4 --> Borrar el calendario
        await CalendarioModel.findOneAndDelete({anoCalendario: 2024})

        //Paso 5 --> Resetear las estadisticas de los jugadores a 0
        await EstadisticasModel.updateMany({}, {
            asistencias: 0,
            partidosJugados: 0,
            goles: 0
        });

        //Paso 6 --> Generar el calendario de nuevo y las 38 jornadas
        await generarCalendario();

        //Paso 7 --> Ganerar la tabla de clasificación de la jornada 1
        await generarTablaClasificacion();

        res.status(200).json({message: 'Reset del calendario hecho correctamente'})
        

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({ message: error.message });
    }
}