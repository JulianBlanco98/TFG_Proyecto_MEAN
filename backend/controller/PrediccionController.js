import { historicoJornadaActual } from "../helper/sendCorreo.js";
import { PrediccionModel } from "../model/PrediccionModel.js";
import { JornadaModel } from "../model/SimularLiga/JornadaModel.js";
import { UserModel } from "../model/UserModel.js";

export const hacerPrediccionByJornada = async (req, res) => {
    try {
        const { numJornada, tipoPredi } = req.params;
        const predicciones = req.body;
        const usuario = await UserModel.findById(req.usuario.id);
        console.log(
            "Numero jornada para prediccion: ",
            numJornada,
            " TipoPredi:",
            tipoPredi
        );
        console.log("Datos de predicción: ", predicciones);
        //console.log("Usuario logueado: ", usuario);

        //1. Ver si existe la predicción
        let prediccion = await PrediccionModel.findOne({
            idUsuario: usuario.id,
            numeroJornada: numJornada,
        });
        let totalMonedas = 0;

        //2 Si no existe, creo los campos principales
        if (!prediccion) {
            prediccion = new PrediccionModel({
                idUsuario: usuario._id,
                numeroJornada: numJornada,
                monedaInicial: usuario.moneda,
                monedasGanadas: 0,
                ganado: false,
                tipo_1: [],
                tipo_2: [],
                tipo_3: [],
            });
        }
        //3 Dependiendo del tipo, creo la predicción nueva del tipo 1,2,3
        switch (parseInt(tipoPredi)) {
            case 1:
                let campoPrediNoSeleccionado = true;
                let campoCantidadVacio = false;
                let campoInvalido;

                for (let i = 0; i < predicciones.length; i++) {
                    const p = predicciones[i];
                    totalMonedas += p.cantidad;
                    if (p.cantidad !== 0 && p.prediccion === "") {
                        campoPrediNoSeleccionado = false;
                        campoInvalido = p.indicePartido;
                        break; // Termino el bucle si se encuentra un campo inválido
                    }
                    if (
                        (p.cantidad === 0 || p.cantidad === null) &&
                        p.prediccion !== ""
                    ) {
                        campoCantidadVacio = true;
                        campoInvalido = p.indicePartido;
                        break;
                    }
                    console.log("Predicción multi: ", p.multi);

                    //Aquí ha pasao todos los controles, y multi tiene datos, por lo que la prediccion es correcta
                    if (p.multi) {
                        prediccion.tipo_1.push({
                            indicePartido: p.indicePartido,
                            prediGanador: p.prediccion,
                            multiPrediccion: parseFloat(p.multi),
                            cantidad: p.cantidad,
                        });
                    }
                }

                console.log("Total de monedas apostadas: ", totalMonedas);
                console.log("Monedas del usuario: ", usuario.moneda);

                if (usuario.moneda < totalMonedas) {
                    return res
                        .status(400)
                        .json({
                            message: `No tienes suficientes monedas ${usuario.datos.nombre}!`,
                        });
                }
                if (campoCantidadVacio) {
                    return res
                        .status(400)
                        .json({
                            message: `No has usado ninguna moneda en el partido de la fila ${campoInvalido} `,
                        });
                }
                if (!campoPrediNoSeleccionado) {
                    return res
                        .status(400)
                        .json({
                            message: `En el partido de la fila ${campoInvalido} no has hecho ninguna predicción`,
                        });
                }
                break;
            case 2:
                predicciones.predicciones.forEach((p) => {
                    totalMonedas = totalMonedas + p.cantidad;
                    console.log("Campo de equipo: ", p.equipo.nombreEquipo);
                    prediccion.tipo_2.push({
                        idEquipo: p.equipo._id,
                        goles: p.goles,
                        cantidad: p.cantidad,
                    });
                });
                if (usuario.moneda < totalMonedas) {
                    return res
                        .status(400)
                        .json({
                            message: `No tienes suficientes monedas ${usuario.datos.nombre}!`,
                        });
                }
                break;
            default:
                console.log("Crear predi tipo3");
                
                predicciones.predicciones.forEach((p) => {
                    totalMonedas = totalMonedas + p.cantidad;
                    console.log("Campo de equipo: ", p.equipo.nombreEquipo);
                    prediccion.tipo_3.push({
                        idEquipo: p.equipo._id,
                        asistencias: p.asistencias,
                        cantidad: p.cantidad,
                    });
                });
                if (usuario.moneda < totalMonedas) {
                    return res
                        .status(400)
                        .json({
                            message: `No tienes suficientes monedas ${usuario.datos.nombre}!`,
                        });
                }
                break;
        }

        console.log("Predicciones hechas: ", prediccion);
        //4 Restar lsa monedas al jugador y actualizar el usuario
        usuario.moneda = usuario.moneda - totalMonedas;
        await usuario.save();

        //5 Guardar la predicción en la base de datos
        await prediccion.save();

        res
            .status(201)
            .json({
                message: `Predicción de tipo ${tipoPredi} guardada correctamente`,
            });
    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: error.message });
    }
};
export const deletePrediccionByJornada = async (req, res) => {
    try {
        const { numJornada, tipoPredi } = req.params;
        const usuario = await UserModel.findById(req.usuario.id);
        const prediccion = await PrediccionModel.findOne({
            idUsuario: usuario._id,
            numeroJornada: numJornada,
        });
        if (!prediccion) {
            return res.status(404).json({ message: "Predicción no encontrada" });
        }

        let totalMonedas = 0;
        let tipoActual;
        switch (parseInt(tipoPredi)) {
            case 1:
                tipoActual = "tipo_1";
                break;
            case 2:
                tipoActual = "tipo_2";
                break;
            default:
                tipoActual = "tipo_3";
                break;
        }

        prediccion[tipoActual].forEach((p) => {
            totalMonedas = totalMonedas + p.cantidad;
        });

        const otrosTipos = ["tipo_1", "tipo_2", "tipo_3"]
            .filter((tipo) => tipo !== tipoActual)
            .every((tipo) => prediccion[tipo].length === 0);

        //Si los otros tipos de predicción están vacíos, borro el documento entero
        if (otrosTipos) {
            await PrediccionModel.findByIdAndDelete(prediccion._id);
        }
        //Si no, borro el campo tipo correspondiente
        else {
            prediccion[tipoActual] = [];
            await prediccion.save();
        }

        usuario.moneda = usuario.moneda + totalMonedas;
        await usuario.save();
        res
            .status(200)
            .json({
                message: `La predicción de tipo ${tipoPredi} se ha borrado correctamente`,
            });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const actualizarPrediccionByJornada = async (req, res) => {
    try {
        console.log("Estoy en actualizarPrediccion");
        const { numJornada, tipoPredi } = req.params;
        const predicciones = req.body;
        const usuario = await UserModel.findById(req.usuario.id);
        //console.log("Numero jornada para prediccion: ", numJornada);
        console.log("Datos de actualizar predicción: ", predicciones);
        //console.log("Usuario logueado: ", usuario);

        let totalMonedas = 0;
        let prediccionesHechas = {
            tipo_1: [],
            tipo_2: [],
            tipo_3: [],
        };

        switch (parseInt(tipoPredi)) {
            case 1:
                let campoPrediNoSeleccionado = true;
                let campoCantidadVacio = false;
                let campoInvalido;

                for (let i = 0; i < predicciones.length; i++) {
                    const p = predicciones[i];
                    totalMonedas += p.cantidad;
                    if (p.cantidad !== 0 && p.prediccion === "") {
                        campoPrediNoSeleccionado = false;
                        campoInvalido = p.indicePartido;
                        break; // Termino el bucle si se encuentra un campo inválido
                    }
                    if ((p.cantidad === 0 || p.cantidad === null) && p.prediccion !== "") {
                        campoCantidadVacio = true;
                        campoInvalido = p.indicePartido;
                        break;
                    }
                    //Aquí ha pasao todos los controles, y multi tiene datos, por lo que la prediccion es correcta
                    if (p.multi) {
                        prediccionesHechas.tipo_1.push({
                            indicePartido: p.indicePartido,
                            prediGanador: p.prediccion,
                            multiPrediccion: parseFloat(p.multi),
                            cantidad: p.cantidad,
                        });
                    }
                }

                console.log("Total de monedas apostadas: ", totalMonedas);
                console.log("Monedas del usuario: ", usuario.moneda);

                if (usuario.moneda < totalMonedas) {
                    return res
                        .status(400)
                        .json({
                            message: `No tienes suficientes monedas ${usuario.datos.nombre}!`,
                        });
                }
                if (campoCantidadVacio) {
                    return res
                        .status(400)
                        .json({
                            message: `No has usado ninguna moneda en el partido de la fila ${campoInvalido} `,
                        });
                }
                if (!campoPrediNoSeleccionado) {
                    return res
                        .status(400)
                        .json({
                            message: `En el partido de la fila ${campoInvalido} no has hecho ninguna predicción`,
                        });
                }

                break;

            case 2:
                predicciones.predicciones.forEach(p => {
                    totalMonedas = totalMonedas + p.cantidad;
                    prediccionesHechas.tipo_2.push({
                        idEquipo: p.equipo._id,
                        goles: p.goles,
                        cantidad: p.cantidad,
                    });
                });
                

                if (usuario.moneda < totalMonedas) {
                    return res
                        .status(400)
                        .json({
                            message: `No tienes suficientes monedas ${usuario.datos.nombre}!`,
                        });
                }

                break;

            default:
                predicciones.predicciones.forEach(p => {
                    totalMonedas = totalMonedas + p.cantidad;
                    prediccionesHechas.tipo_3.push({
                        idEquipo: p.equipo._id,
                        goles: p.goles,
                        cantidad: p.cantidad,
                    });
                });
                

                if (usuario.moneda < totalMonedas) {
                    return res
                        .status(400)
                        .json({
                            message: `No tienes suficientes monedas ${usuario.datos.nombre}!`,
                        });
                }
                break;
        }

        //Actualizo el campo de tipo segun la prediccion mandada: 1,2,3
        const actualizarCampo = {};
        actualizarCampo[`tipo_${tipoPredi}`] =
            prediccionesHechas[`tipo_${tipoPredi}`];

        const prediccionExistente = await PrediccionModel.findOneAndUpdate(
            {
                idUsuario: req.usuario.id,
                numeroJornada: numJornada,
            },
            {
                $set: actualizarCampo,
            },
            {
                new: true,
            }
        );

        usuario.moneda = prediccionExistente.monedaInicial - totalMonedas;
        await usuario.save();

        return res.status(200).json({
            message: `Predicción ${tipoPredi} actualizada correctamente`,
            prediccionExistente,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const getPrediccionByJornada = async (req, res) => {
    try {
        const { numJornada } = req.params;
        //const usuario = await UserModel.findById(req.usuario.id);
        const prediccion = await PrediccionModel.findOne({
            idUsuario: req.usuario.id,
            numeroJornada: numJornada,
        });
        if (!prediccion) {
            return res
                .status(404)
                .json({ message: "No se ha encontrado la prediccion" });
        }

        res.status(200).json(prediccion);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const getPrediccionesHechas = async (req, res) => {
    try {
        const prediccionesHechas = await PrediccionModel.find({
            idUsuario: req.usuario.id,
            jugado: true
        })
        .sort({
            numeroJornada: 1
        })
        .populate({
            path: 'tipo_2.idEquipo',
            select: 'nombreEquipo escudoEquipo'
        })
        .populate({
            path: 'tipo_3.idEquipo',
            select: 'nombreEquipo escudoEquipo'
        });
        // console.log("Predicciones hechas: ",prediccionesHechas);
        
        if(prediccionesHechas.length === 0) {
            return res.status(404).json({message: 'No hay predicciones hechas'});
        }

        res.status(200).json(prediccionesHechas);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
export const actualizarMonedasPrediccion = async (jornadaActual) => {
    try {
        // 1 --> Recupero todas las predicciones de los usuarios para esta jornada
        const prediccionesActual = await PrediccionModel.find({
            numeroJornada: jornadaActual.numeroJornada
        });

        const usuariosMap = new Map();
        const prediccionesActualizadasMap = new Map();

        // 2 --> Recorro las predicciones de los usuarios primero para inicializar las monedas ganadas
        for (const prediccion of prediccionesActual) {
            let monedasGanadas = 0;
            let cantidadMonedasApostadas = 0;

            // 3 --> Recorro los partidos para ir asignado las monedas dependiendo de la predicción
            for (const partido of jornadaActual.partidos) {
                const resultadoReal = {
                    ganador: partido.golesLocal > partido.golesVisitante ? 'local' : partido.golesLocal < partido.golesVisitante ? 'visitante' : 'empate',
                    golesLocal: partido.golesLocal,
                    golesVisitante: partido.golesVisitante,
                    asistenciasLocal: partido.asistenciasLocal,
                    asistenciasVisitante: partido.asistenciasVisitante
                };

                console.log("Partido", jornadaActual.partidos.indexOf(partido), " de la jornada ", jornadaActual.numeroJornada, " : ", resultadoReal.golesLocal, " vs ", resultadoReal.golesVisitante, " | Asistencias: ", resultadoReal.asistenciasLocal, " vs ", resultadoReal.asistenciasVisitante);

                // 3.1 --> Tipo1: Quiniela (Local, Empate, Visitante)
                if (prediccion.tipo_1.length > 0) {
                    for (const tipo1 of prediccion.tipo_1) {
                        cantidadMonedasApostadas += tipo1.cantidad;
                        if (tipo1.indicePartido === jornadaActual.partidos.indexOf(partido)) {
                            const prediccionResultado = tipo1.prediGanador;
                            const resultadoPartido = resultadoReal.ganador;

                            if (prediccionResultado === resultadoPartido) {
                                monedasGanadas += tipo1.cantidad * tipo1.multiPrediccion;
                                tipo1.isGanada = true;
                            }
                        }
                    }
                }

                // 3.2 --> Tipo2: Predicción de Goles
                if (prediccion.tipo_2.length > 0) {
                    for (const tipo2 of prediccion.tipo_2) {
                        cantidadMonedasApostadas += tipo2.cantidad;

                        if ((tipo2.idEquipo.toString() === partido.equipoLocal._id.toString() && tipo2.goles === resultadoReal.golesLocal) || (tipo2.idEquipo.toString() === partido.equipoVisitante._id.toString() && tipo2.goles === resultadoReal.golesVisitante)) {
                            monedasGanadas += tipo2.cantidad * 3;
                            tipo2.isGanada = true;
                            console.log("Monedas acumuladas: ",monedasGanadas);
                            
                        }
                    }
                }

                // 3.3 --> Tipo3: Predicción de asistencias
                if (prediccion.tipo_3.length > 0) {
                    for (const tipo3 of prediccion.tipo_3) {
                        cantidadMonedasApostadas += tipo3.cantidad;
                        if ((tipo3.idEquipo.toString() === partido.equipoLocal._id.toString() && tipo3.asistencias === resultadoReal.asistenciasLocal) || (tipo3.idEquipo.toString() === partido.equipoVisitante._id.toString() && tipo3.asistencias === resultadoReal.asistenciasVisitante)) {
                            monedasGanadas += tipo3.cantidad * 3;
                            tipo3.isGanada = true;
                        }
                    }
                }
            }

            console.log("Total de monedas ganadas para esta predicción: ", monedasGanadas);

            // 4 --> Actualizar en memoria el usuario
            let usuario = usuariosMap.get(prediccion.idUsuario);
            if (!usuario) {
                usuario = await UserModel.findById(prediccion.idUsuario);
                usuariosMap.set(prediccion.idUsuario, usuario);
            }

            // 5 --> Si ha ganado monedas, actualizar el saldo al jugador
            if (monedasGanadas > 0 && usuario) {
                prediccion.monedasGanadas = monedasGanadas;
                usuario.moneda += monedasGanadas;
            }

            // 6 --> Marcar la predicción como jugada y ganado si corresponde
            prediccion.jugado = true;
            if (usuario && usuario.moneda > prediccion.monedaInicial) {
                prediccion.ganado = true;
            }
            // Añadir la predicción hecha al usuario en su campo predicciones
            if(usuario) {
                usuario.predicciones.push(prediccion._id);
            }
            
            prediccionesActualizadasMap.set(prediccion._id.toString(), prediccion);
        }

        // 7 --> Guardar todas las predicciones actualizadas en la base de datos
        await Promise.all(Array.from(prediccionesActualizadasMap.values()).map(prediccion => prediccion.save()));
        console.log(prediccionesActualizadasMap);

        // 8 --> Guardar todos los usuarios actualizados en la base de datos
        await Promise.all(Array.from(usuariosMap.values()).map(usuario => usuario.save()));

        console.log("Aquí ya se han actualizado las predicciones y los usuarios. Ahora, se llamará a la función del correo");

        // 9 --> Enviar correos electrónicos a los usuarios
        for (const usuario of usuariosMap.values()) {
            const prediccionesActualizadas = await PrediccionModel.findOne({ 
                idUsuario: usuario._id,
                numeroJornada: jornadaActual.numeroJornada
            });
            await historicoJornadaActual(usuario, prediccionesActualizadas);
        }

    } catch (error) {
        console.log(error);
    }
};


