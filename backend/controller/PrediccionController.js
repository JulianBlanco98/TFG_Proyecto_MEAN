import { PrediccionModel } from "../model/PrediccionModel.js";
import { UserModel } from "../model/UserModel.js";


export const hacerPrediccionByJornada = async (req, res) => {
    try {
        const { numJornada } = req.params;
        const predicciones = req.body;
        const usuario = await UserModel.findById(req.usuario.id);
        //console.log("Numero jornada para prediccion: ", numJornada);
        console.log("Datos de predicción: ", predicciones);
        //console.log("Usuario logueado: ", usuario);

        let campoPrediNoSeleccionado = true;
        let campoCantidadVacio = false;
        let campoInvalido;

        let totalMonedas = 0;
        let prediccionesHechas = {
            idUsuario: usuario._id,
            numeroJornada: numJornada,
            monedaInicial: usuario.moneda,
            ganado: false,
            tipo_1: []
        }

        for (let i = 0; i < predicciones.length; i++) {
            const p = predicciones[i];
            totalMonedas += p.cantidad;
            if (p.cantidad !== 0 && p.prediccion === '') {
                campoPrediNoSeleccionado = false;
                campoInvalido = p.indicePartido;
                break; // Termino el bucle si se encuentra un campo inválido
            }
            if((p.cantidad === 0 || p.cantidad === null) && p.prediccion !== '') {
                campoCantidadVacio = true;
                campoInvalido = p.indicePartido;
                break;
            }
            //Aquí ha pasao todos los controles, y multi tiene datos, por lo que la prediccion es correcta
            if(p.multi) {
                prediccionesHechas.tipo_1.push({
                    indicePartido: p.indicePartido,
                    prediGanador: p.prediccion,
                    multiPrediccion: parseFloat(p.multi),
                    cantidad: p.cantidad
                });
            }
        }

        console.log("Total de monedas apostadas: ",totalMonedas);
        console.log("Monedas del usuario: ",usuario.moneda);

        if(usuario.moneda < totalMonedas) {
            return res.status(400).json({message: `No tienes suficientes monedas ${usuario.datos.nombre}!`})
        }
        if(campoCantidadVacio){
            return res.status(400).json({message: `No has usado ninguna moneda en el partido de la fila ${campoInvalido} `});
        }
        if(!campoPrediNoSeleccionado){
            return res.status(400).json({message: `En el partido de la fila ${campoInvalido} no has hecho ninguna predicción`});
        }

        const nuevaPrediccion = new PrediccionModel(prediccionesHechas);
        console.log("Nueva prediccion: ",nuevaPrediccion);

        await nuevaPrediccion.save();
        
        
        res.status(201).json({message: 'Predicción guardada correctamente'})
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const getPrediccionByJornada = async (req, res) => {
    try {
        const { numJornada } = req.params;
        //const usuario = await UserModel.findById(req.usuario.id);

        const prediccionTipo1 = await PrediccionModel.findOne({
            idUsuario: req.usuario.id,
            numeroJornada: numJornada
        });
        if(!prediccionTipo1){
            return res.status(404).json({ message: 'No se ha encontrado la prediccion' });
        }

        res.status(200).json(prediccionTipo1);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}