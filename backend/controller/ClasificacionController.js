import { ClasificacionModel } from "../model/SimularLiga/ClasificacionModel.js";
import { EquiposModel } from "../model/EquiposModel.js";
import { JornadaModel } from "../model/SimularLiga/JornadaModel.js";

export const getTablaClasificacion = async (req, res) => {
    try {
        //console.log("Get Clasificacion");
        const clasificacion = await ClasificacionModel.findOne().sort({_id: -1})
        .populate('tabla.equipoPosicion', 'nombreEquipoCorto escudoEquipo');

        if(!clasificacion){
            return res.status(400).json(`La tabla de clasificacion no está creada`)
        }

        return res.status(200).json(clasificacion);


    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const calcularMulti = async (posicion) => {
    const minimo = 1.1;
    const maximo = 6;
    const totalEquipos = 20;
    const multi = minimo + ((posicion-1) * (maximo - minimo) / (totalEquipos-1))
    return multi.toFixed(2);
};
const crearJSONMulti = async (clasificacion) => {
    const tabla = await Promise.all(
        clasificacion.tabla.map(async equipo => ({
            equipo: equipo.equipoPosicion._id,
            multi: await calcularMulti(equipo.posicion)
        }))
    );

    return { tabla }
};

export const getMultiplicadorTipo1 = async (req,res) => {
    try {
        const clasificacion = await ClasificacionModel.findOne().sort({numeroJornada: -1});

        if(!clasificacion){
            return res.status(400).json(`La tabla de clasificacion no está creada`)
        }
        // console.log("Estoy después de la clasificación");
        
        let respuesta;
        //Mismo multi para todos --> Primera jornada
        if(clasificacion.numeroJornada === 0){
            respuesta = {
                tabla: clasificacion.tabla.map(equipo => ({
                    equipo: equipo.equipoPosicion._id,
                    multi: 1.50,
                }))
            };
        }
        else{
            respuesta = await crearJSONMulti(clasificacion);
        }

        return res.status(200).json(respuesta);

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}