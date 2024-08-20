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
            numeroJornada: -1
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

        const usuariosNotificados = new Set();

        // 2 --> Recorro los partidos para guardar los resultados en una variable
        for (const partido of jornadaActual.partidos) {
            const resultadoReal = {
                ganador: partido.golesLocal > partido.golesVisitante ? 'local' : partido.golesLocal < partido.golesVisitante ? 'visitante' : 'empate',
                golesLocal: partido.golesLocal,
                golesVisitante: partido.golesVisitante,
                asistenciasLocal: partido.asistenciasLocal,
                asistenciasVisitante: partido.asistenciasVisitante
            };

            // 3 --> Recorro las predicciones de los usuarios para ir asignado las monedas dependiendo de la predicción
            for (const prediccion of prediccionesActual) {
                let monedasGanadas = 0;
                let cantidadMonedasApostadas = 0;

                // 3.1 --> Tipo1: Quiniela (Local, Empate, Visitante)
                if (prediccion.tipo_1.length > 0) {
                    for (const tipo1 of prediccion.tipo_1) {
                        cantidadMonedasApostadas += tipo1.cantidad;
                        if (tipo1.indicePartido === jornadaActual.partidos.indexOf(partido)) {
                            const prediccionResultado = tipo1.prediGanador;
                            const resultadoPartido = resultadoReal.ganador;

                            // Si coinciden estos 2 valores, significa que el usuario ha acertado este partido en la quiniela
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
                        
                        console.log(`Tipo2: ${JSON.stringify(tipo2)}`);
                        console.log(`tipo2.goles: ${tipo2.goles}, tipo2.goles (type): ${typeof tipo2.goles}`);
                        console.log(`partido.golesLocal: ${partido.golesLocal}, partido.golesLocal (type): ${typeof partido.golesLocal}`);

                        if ((tipo2.idEquipo === partido.equipoLocal) && (tipo2.goles === partido.golesLocal)) {
                            monedasGanadas += tipo2.cantidad * 2;
                            tipo2.isGanada = true;
                        } else if ((tipo2.idEquipo === partido.equipoVisitante) && (tipo2.goles === partido.golesVisitante)) {
                            monedasGanadas += tipo2.cantidad * 2;
                            tipo2.isGanada = true;
                        }
                    }
                }

                // 3.3 --> Tipo3: Predicción de asistencias
                if (prediccion.tipo_3.length > 0) {
                    for (const tipo3 of prediccion.tipo_3) {
                        console.log(`Tipo3: ${JSON.stringify(tipo3)}`)
                        console.log(`tipo3.asistencias: ${tipo3.asistencias}, tipo3.asistencias (type): ${typeof tipo3.asistencias}`);
                        console.log(`partido.asistenciasLocal: ${partido.asistenciasLocal}, partido.asistenciasLocal (type): ${typeof partido.asistenciasLocal}`);

                        cantidadMonedasApostadas += tipo3.cantidad;
                        if ((tipo3.idEquipo === partido.equipoLocal) && (tipo3.asistencias === partido.asistenciasLocal)) {
                            monedasGanadas += tipo3.cantidad * 2;
                            tipo3.isGanada = true;
                        } else if ((tipo3.idEquipo === partido.equipoVisitante) && (tipo3.asistencias === partido.asistenciasVisitante)) {
                            monedasGanadas += tipo3.cantidad * 2;
                            tipo3.isGanada = true;
                        }
                    }
                }

                // 4 --> Recuperar el usuario
                const usuario = await UserModel.findById(prediccion.idUsuario);

                // 5 --> Si ha ganado monedas, le actualizo el saldo al jugador
                if (monedasGanadas > 0 && usuario) {
                    prediccion.monedasGanadas = monedasGanadas;
                    usuario.moneda += monedasGanadas;
                    await usuario.save();
                }

                // 6 --> Guardar la prediccion actualizada
                prediccion.jugado = true;
                if ((cantidadMonedasApostadas + monedasGanadas) > prediccion.monedaInicial) {
                    prediccion.ganado = true;
                }
                await prediccion.save();

                // 7 --> Enviar un correo a cada usuario con el resumen de la predicción
                if (!usuariosNotificados.has(usuario._id.toString())) {
                    await historicoJornadaActual(usuario, prediccion, cantidadMonedasApostadas);
                    usuariosNotificados.add(usuario._id.toString());
                }
            }
        }

        // res.status(200).json({message: 'Predicciones actualizadas correctamente'});

    } catch (error) {
        console.log(error);
        // return res.status(500).json({ message: error.message });
    }
}
