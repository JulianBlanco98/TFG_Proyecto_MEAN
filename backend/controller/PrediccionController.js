import { PrediccionModel } from "../model/PrediccionModel.js";
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
export const createPrediTipo2 = async (req, res) => {
    try {
        const { numJornada } = req.params;
        const predicciones = req.body;
        const usuario = await UserModel.findById(req.usuario.id);
        console.log("Predicciones tipo2: ", predicciones);

        let totalMonedas = 0;
        let prediccionesHechas = {
            idUsuario: usuario._id,
            numeroJornada: numJornada,
            monedaInicial: usuario.moneda,
            ganado: false,
            tipo_2: [],
        };
        predicciones.predicciones.forEach((p) => {
            totalMonedas = totalMonedas + p.cantidad;
            console.log("Campo de equipo: ", p.equipo.nombreEquipo);
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
        console.log("Predicciones hechas: ", prediccionesHechas);

        //aqui sería ver como compaginar los 3 tipos de predicción

        res
            .status(201)
            .json({ message: "Predicción de goles guardada correctamente" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
