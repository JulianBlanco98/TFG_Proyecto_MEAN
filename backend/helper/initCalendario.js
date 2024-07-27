import { CalendarioModel } from "../model/SimularLiga/CalendarioModel.js";
import { EquiposModel } from "../model/EquiposModel.js";
import { JornadaModel } from "../model/SimularLiga/JornadaModel.js";

export const generarCalendario = async (req, res) => {
    try {
        console.log("GenerarCalendario");

        const calendarioExiste = CalendarioModel.find();
        if ((await calendarioExiste).length > 0) {
            console.log("Ya está generado el calendario...");
        } else {
            const equipos = await EquiposModel.find();
            const numeroEquipos = equipos.length; //20 equipos
            const numeroJornadas = numeroEquipos - 1; //19 jornadas de la primera vuelta
            const mitad = numeroEquipos / 2;

            let calendario = new CalendarioModel({
                anoCalendario: 2024,
                pais: "España",
                escudoLiga: "/assets/img/logoLiga2.png",
                jornadas: [],
            });

            //Primera Vuelta: 19 jornadas
            for (let i = 0; i < numeroJornadas; i++) {
                let jornada = new JornadaModel({ numeroJornada: i + 1, partidos: [] });

                for (let j = 0; j < mitad; j++) {
                    //Coger los dos equipos que se van a enfrentar
                    const equipoLocal = equipos[j]._id;
                    const equipoVisitante = equipos[numeroEquipos - 1 - j]._id;

                    //Añadir el partido
                    jornada.partidos.push({
                        equipoLocal: equipoLocal,
                        equipoVisitante: equipoVisitante,
                        golesLocal: 0,
                        golesVisitante: 0,
                        asistenciasLocal: 0,
                        asistenciasVisitante: 0
                    });
                }

                await jornada.save();

                calendario.jornadas.push(jornada);

                //Rotar los equipos para hacer el Round Robin
                equipos.splice(1, 0, equipos.pop());
            }
            // Segunda vuelta
            for (let i = 0; i < numeroJornadas; i++) {
                let jornada = new JornadaModel({
                    numeroJornada: numeroJornadas + i + 1,
                    partidos: [],
                });

                for (let j = 0; j < mitad; j++) {
                    // Coger los dos equipos que se van a enfrentar, pero intercambiando local y visitante
                    const equipoLocal = equipos[numeroEquipos - 1 - j]._id;
                    const equipoVisitante = equipos[j]._id;

                    // Añadir el partido
                    jornada.partidos.push({
                        equipoLocal: equipoLocal,
                        equipoVisitante: equipoVisitante,
                        golesLocal: 0,
                        golesVisitante: 0,
                        asistenciasLocal: 0,
                        asistenciasVisitante: 0
                    });
                }

                await jornada.save();

                // Añadir la jornada al calendario
                calendario.jornadas.push(jornada);

                // Rotar los equipos para hacer el Round Robin
                equipos.splice(1, 0, equipos.pop());
            }

            // Guardo el calendario en la base de datos
            await calendario.save();
        }
    } catch (error) {
        console.error(error);
    }
};
