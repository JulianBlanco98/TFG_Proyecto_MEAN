import { EquiposModel } from "../model/EquiposModel.js";
import { ClasificacionModel } from "../model/SimularLiga/ClasificacionModel.js";

export const generarTablaClasificacion = async (req, res) => {

    try {
        
        console.log("Generando tabla de clasificacion...");
        const tablaExiste = await ClasificacionModel.findOne();
        //console.log(tablaExiste);
        if (tablaExiste) {
            console.log("Ya esta generada la tabla de clasificacion");
        } else {
            const equipos = await EquiposModel.find().sort({nombreEquipoCorto: 1})
            if(equipos.length !== 20){
                console.log("No están los 20 equipos");
                return;
            }

            const tabla = equipos.map((equipo, indice) => ({
                posicion: indice + 1,
                equipoPosicion: equipo._id,
            }));

            const nuevaClasificacion = new ClasificacionModel({tabla});
            await nuevaClasificacion.save()
            console.log("Tabla de clasificacion guardada...");

        }

    } catch (error) {
        console.error("Error al generar la tabla de clasificacion", error);
    }
}