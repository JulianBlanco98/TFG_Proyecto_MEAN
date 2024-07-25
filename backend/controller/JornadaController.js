import { JornadaModel } from "../model/SimularLiga/JornadaModel.js";
import { EquiposModel } from "../model/EquiposModel.js";
import randomNumber from 'random-number-csprng'
import { ClasificacionModel } from "../model/SimularLiga/ClasificacionModel.js";


export const getJornadaByNumero = async (req,res) => {

    try {
        const {numero} = req.params
        console.log("Parametro del numero de jornada: ", numero);
        const jornada = await JornadaModel.findOne({numeroJornada: numero})
        .populate('partidos.equipoLocal', 'nombreEquipoCorto escudoEquipo')
        .populate('partidos.equipoVisitante', 'nombreEquipoCorto escudoEquipo');

        if(!jornada){
            return res.status(400).json(`Esta jornada no existe`)
        }

        return res.status(200).json(jornada)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
//Put, ya que voy a actualizar los datos de jornada
export const simularJornadaActual = async (req, res) => {

    try {
        let jornadaActual = await JornadaModel.find({jugado: false})
        .populate('partidos.equipoLocal partidos.equipoVisitante');
        if(!jornadaActual){
            return res.status(404).json({message: "Todas las jornadas se han jugado ya"})
        }
        console.log("Numero de jornada a simular: ",jornadaActual.numeroJornada);
        //Generar los goles de manera aleatoria
        const promesas = jornadaActual.partidos.map(async partido => {
            partido.golesLocal = await randomNumber(0, 6);
            partido.golesVisitante = await randomNumber(0, 6);
        });

        //Se tienen que resolver todas las promesas (resultados de los partidos)
        await Promise.all(promesas);

        jornadaActual.jugado = true;

        //Tengo que actualizar la clasificacion y las estadisticas de los jugadores
        //Primero: clasificacion

        const numeroJornada = jornadaActual.numeroJornada - 1;

        let tablaClasificacion = await ClasificacionModel.findOne({numeroJornada: numeroJornada})
        if(!tablaClasificacion){
            return res.status(404).json({message: 'Tabla de clasificación no encontrada'})
        }

        let nuevaClasificacion = {
            numeroJornada: jornadaActual.numeroJornada,
            tabla: JSON.parse(JSON.stringify(tablaClasificacion.tabla)) //Clonar la tabla
        }

        //Recorrer la jornada actualizada para darle los valores a cada equipo
        jornadaActual.partidos.forEach(partido => {
            const local = nuevaClasificacion.tabla.find(e => e.equipoPosicion.equals(partido.equipoLocal._id))
            const visitante = nuevaClasificacion.tabla.find(e => e.equipoPosicion.equals(partido.equipoVisitante._id))

            //Partidos jugados: sumarles 1
            local.estadisticas.partidosJugados += 1
            visitante.estadisticas.partidosJugados += 1

            //Goles: sumar goles a favor y en contra, y hacer la diferencia entre ellos
            local.estadisticas.golesAFavor += partido.golesLocal;
            local.estadisticas.golesEnContra += partido.golesVisitante;
            local.estadisticas.diferenciaGoles += (partido.golesLocal - partido.golesVisitante);

            visitante.estadisticas.golesAFavor += partido.golesVisitante;
            visitante.estadisticas.golesEnContra += partido.golesLocal;
            visitante.estadisticas.diferenciaGoles += (partido.golesVisitante - partido.golesLocal);

            //Metodología de puntos: 3 puntos victoria / 1 punto empate / 0 puntos derrota
            //Mas goles del local: gana el local
            if(partido.golesLocal > partido.golesVisitante){
                local.estadisticas.victorias += 1;
                local.estadisticas.puntos += 3;
                visitante.estadisticas.derrotas += 1;
            }
            //Mas goles del visitante: gana el visitante
            else if(partido.golesLocal < partido.golesVisitante){
                visitante.estadisticas.victorias += 1;
                visitante.estadisticas.puntos += 3;
                local.estadisticas.derrotas += 1
            }
            //Empate
            else{
                local.estadisticas.empates += 1;
                visitante.estadisticas.empates += 1;
                local.estadisticas.puntos += 1;
                visitante.estadisticas.puntos += 1;
            }

        });

        //Una vez actualizado las estadisiticas de cada equipo, hay que ordenar los equipos según:
        //1: Por puntos, 2: Igualdad de puntos --> GF, 3: Igualdad de puntos y GF --> Victorias
        nuevaClasificacion.tabla.sort((a,b) => {
            if(b.estadisticas.puntos !== a.estadisticas.puntos){
                return b.estadisticas.puntos - a.estadisticas.puntos;
            }
            else if(b.estadisticas.golesAFavor !== a.estadisticas.golesAFavor){
                return b.estadisticas.golesAFavor - a.estadisticas.golesAFavor;
            }
            else{
                b.estadisticas.victorias - a.estadisticas.victorias;
            }
        });

        //Actualizar las posiciones
        nuevaClasificacion.tabla.forEach((equipo, indice) => {
            equipo.posicion = indice + 1;
        });


        await jornadaActual.save();
        await ClasificacionModel.create(nuevaClasificacion);

        res.status(200).json({message: 'Jornada simulada con éxito', jornada: jornadaActual})

    } catch (error) {
        res.status(500).json({message: 'Error al simular la jornada', error})
    }

}

/**
 * Función privada para seleccionar los jugadores que van a jugar en la jornada actual
 * @param jugadores: 4-3-3 + portero
 */
const seleccionarJugadores = (jugadores) => {

    const porteros = jugadores.filter(jugador => jugador.datos.posicion === 'Goalkeeper')
    const defensas = jugadores.filter(jugador => jugador.datos.posicion === 'Defence')
    const mediocentros = jugadores.filter(jugador => jugador.datos.posicion === 'Midfield')
    const delanteros = jugadores.filter(jugador => jugador.datos.posicion === 'Offence')

    const equipoSeleccioando = {
        portero: await seleccionarAleatorio(porteros, 1),
        defensas: await seleccionarAleatorio(defensas, 1),
        mediocentros: await seleccionarAleatorio(mediocentros, 1),
        delanteros: await seleccionarAleatorio(delanteros, 1),
    }
}
const seleccionarAleatorio = async (array, numero) => {

    const resultado = [];
    const arrayCopia = [...array];

    for (let i = 0; i < numero; i++) {
        const indice = await randomNumber(0, arrayCopia.length-1);
        resultado.push(arrayCopia[indice])
        arrayCopia.splice(indice, 1);
        
    }

    return resultado;
}