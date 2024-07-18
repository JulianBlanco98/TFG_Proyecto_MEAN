import { CalendarioModel } from "../model/SimularLiga/CalendarioModel.js";
import { EquiposModel } from "../model/EquiposModel.js";
import { JornadaModel } from "../model/SimularLiga/JornadaModel.js";


export const generarCalendario = async (req, res) => {

    console.log("GenerarCalendario");
    try {
        

        const calendarioExiste = CalendarioModel.find()
        if((await calendarioExiste).length > 0){
            console.log("Ya está generado el calendario...");
        }
        else{

            const equipos = await EquiposModel.find();
            const numeroEquipos = equipos.length; //20 equipos
            const numeroJornadas = numeroEquipos - 1; //19 jornadas de la primera vuelta
            const mitad = numeroEquipos / 2;
    
            let calendario = new CalendarioModel({
                anoCalendario: 2024,
                pais: "España",
                escudoLiga: '/assets/img/logoLiga2.png',
                jornadas: []
            });
    
            for (let i = 0; i < numeroJornadas; i++) {
                let jornada = new JornadaModel({numeroJornada: i+1, partidos:[]});
    
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
                    });
                    
                }
    
                await jornada.save()
    
                calendario.jornadas.push(jornada);
    
                //Rotar los equipos para hacer el Round Robin
                equipos.splice(1, 0, equipos.pop());
                
            }
    
            await calendario.save()
        }


    } catch (error) {
        console.error(error)
    }
}
