import { JornadaModel } from "../model/SimularLiga/JornadaModel.js";
import { EquiposModel } from "../model/EquiposModel.js";
import randomNumber from 'random-number-csprng'
import { ClasificacionModel } from "../model/SimularLiga/ClasificacionModel.js";
import { JugadorModel } from "../model/JugadorModel.js";


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

export const getJornadaActual = async (req, res) => {
    try {
        //console.log("Conseguir el numero de la jornada actual");
        const jornadaActual = await JornadaModel.findOne({jugado: false});
        if(!jornadaActual){
            return res.status(404).json({message: "Todas las jornadas se han jugado ya"})
        }
        //console.log(jornadaActual);
        //console.log("Numerjo jornada actual: ",jornadaActual.numeroJornada);

        res.status(200).json({numeroJornadaActual: jornadaActual.numeroJornada})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

//Put, ya que voy a actualizar los datos de jornada
export const simularJornadaActual = async (req, res) => {

    try {
        let jornadaActual = await JornadaModel.findOne({jugado: false})
        .populate('partidos.equipoLocal partidos.equipoVisitante');
        if(!jornadaActual){
            return res.status(404).json({message: "Todas las jornadas se han jugado ya"})
        }
        console.log("Numero de jornada a simular: ",jornadaActual.numeroJornada);
        //Generar los goles de manera aleatoria
        const promesasGoles = jornadaActual.partidos.map(async partido => {
            partido.golesLocal = await randomNumber(0, 6);
            partido.golesVisitante = await randomNumber(0, 6);
        });

        //Se tienen que resolver todas las promesas (resultados de los partidos)
        await Promise.all(promesasGoles);

        console.log("Aquí se han generado los goles");

        jornadaActual.jugado = true;

        //Tengo que actualizar la clasificacion y las estadisticas de los jugadores
        //Primero: clasificacion

        let tablaClasificacion = await ClasificacionModel.findOne().sort({numeroJornada: -1})
        if(!tablaClasificacion){
            return res.status(404).json({message: 'Tabla de clasificación no encontrada'})
        }

        let nuevaClasificacion = {
            numeroJornada: jornadaActual.numeroJornada,
            tabla: JSON.parse(JSON.stringify(tablaClasificacion.tabla)) //Clonar la tabla
        }

        console.log("Aqui se ha encontradp la tabla");

        const promesasJugadores = jornadaActual.partidos.map(async partido => {
            const equipoLocal = partido.equipoLocal._id;
            const equipoVisitante = partido.equipoVisitante._id;

            let jugadoresLocal = await JugadorModel.find({idEquipo: equipoLocal}).populate('estadisticas');
            let jugadoresVisitante = await JugadorModel.find({idEquipo: equipoVisitante}).populate('estadisticas');

            //Escoger los 11 jugadores que van a jugar el partido
            let equipoLocalSeleccionado = await seleccionarJugadores(jugadoresLocal);
            let equipoVisitanteSeleccionado = await seleccionarJugadores(jugadoresVisitante);

            //console.log("Los jugadores se han escogido");

            //Actualizo los goles y asistencias de estos jugadores del equipo local
            await actualizarEstadisticasJugadores(equipoLocalSeleccionado, partido.golesLocal, "goles");
            await actualizarEstadisticasJugadores(equipoLocalSeleccionado, partido.golesLocal, "asistencias");
            //Actualizo los goles y asistencias de estos jugadores del equipo visitante
            await actualizarEstadisticasJugadores(equipoVisitanteSeleccionado, partido.golesVisitante, "goles");
            await actualizarEstadisticasJugadores(equipoVisitanteSeleccionado, partido.golesVisitante, "asistencias");

            console.log("Estadisticas de jugadores actualizadas");

            //Actualizar la tabla de clasificacion
            actualizarClasificacion(nuevaClasificacion, partido, equipoLocal, equipoVisitante);

        })

        //Esperar a que se actualicen todas las promesas de jugadores
        await Promise.all(promesasJugadores);

        //Una vez actualizado las estadisiticas de cada equipo y jugadores, hay que ordenar los equipos según:
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
 * @param {Array} jugadores - Array de jugadores del equipo 
 */
const seleccionarJugadores = async (jugadores) => {

    const porteros = jugadores.filter(jugador => jugador.datos.posicion === 'Goalkeeper')
    const defensas = jugadores.filter(jugador => jugador.datos.posicion === 'Defence')
    const mediocentros = jugadores.filter(jugador => jugador.datos.posicion === 'Midfield')
    const delanteros = jugadores.filter(jugador => jugador.datos.posicion === 'Offence')

    const equipoSeleccioando = {
        portero: await seleccionarAleatorio(porteros, 1),
        defensas: await seleccionarAleatorio(defensas, 4),
        mediocentros: await seleccionarAleatorio(mediocentros, 3),
        delanteros: await seleccionarAleatorio(delanteros, 3),
    };
    const idApiEquipoP = equipoSeleccioando.portero[0].idApiEquipo;
    //console.log("IDAPI eqipo: ",idApiEquipoP);

    const equipo = await EquiposModel.findOne({idEquipoAPI: idApiEquipoP});
    //console.log(equipo);
    if(!equipo){
        return res.status(404).json({message: 'Equipo no encontrado'})
    }

    //console.log('Equipo seleccionado:', equipo.nombreEquipoCorto);
    console.log(equipo.nombreEquipoCorto," --> Defensas:",equipoSeleccioando.defensas.length," Medios:",equipoSeleccioando.mediocentros.length, " Delanteros:",equipoSeleccioando.delanteros.length);
    console.log('Número total de jugadores:', equipoSeleccioando.portero.length + equipoSeleccioando.defensas.length + equipoSeleccioando.mediocentros.length + equipoSeleccioando.delanteros.length);
    return equipoSeleccioando;
}
/**
 * Función privada para seleccionar los jugadores en cada posicion que van a jugar de manera aleatoria
 * @param {Array} array - Todos los jugadores de una posición especifica
 * @param {Number} numero - Número de jugadores a escoger de esa posicion
 * @returns array de jugadores que van a jugar en esa posicion el partido
 */
const seleccionarAleatorio = async (array, numero) => {

    const resultado = [];
    const arrayCopia = [...array];
    //console.log("Jugadores a escoger: ", arrayCopia.length, " teniendo que coger ",numero);

    for (let i = 0; i < numero; i++) {
        const indice = await randomNumber(0, arrayCopia.length-1);
        resultado.push(arrayCopia[indice])
        arrayCopia.splice(indice, 1);
        
    }

    return resultado;
}
/**
 * Función privada para actualizar las estadisticass de los jugadores que van a jugar el partido
 * @param {array} equipo - Equipo con sus 11 jugadores
 * @param {Number} numeroGoles - Numero de goles para generar los goles y las asistencias
 * @param {String} tipo - Simular "goles" o "asistencias"
 */
const actualizarEstadisticasJugadores = async (equipo, numeroGoles, tipo) => {

    const probabilidad = {
        goles: {delanteros: 65, mediocentros: 25, defensas: 10},
        asistencias: {delanteros: 25, mediocentros: 65, defensas: 10}
    }
    
    const jugadores = [...equipo.delanteros, ...equipo.mediocentros, ...equipo.defensas];
    console.log("Tipo:",tipo," |Numero de goles:",numeroGoles, " |Total de jugadores:",jugadores.length);
    

    for (let i = 0; i < numeroGoles; i++) {
        
        const random = await randomNumber(0, 100); //Probabilidad de 0 a 100
        console.log("Numero aleatorio en estadisticas: ",random);
        let jugSeleccionado;
        if(random < probabilidad[tipo].delanteros){
            jugSeleccionado = equipo.delanteros[await randomNumber(0, equipo.delanteros.length-1)]
            console.log("Goles de un delantero");
        }else if(random < (probabilidad[tipo].delanteros + probabilidad[tipo].mediocentros)){
            jugSeleccionado = equipo.mediocentros[await randomNumber(0, equipo.mediocentros.length-1)]
            console.log("Goles de un mediocentro");
        }else{
            jugSeleccionado = equipo.defensas[await randomNumber(0, equipo.defensas.length-1)]
            console.log("Goles de un defensa");
        }
        //console.log("Antes del if de tipos");
        if(tipo === "goles"){
            jugSeleccionado.estadisticas.goles += 1;
            console.log("Dentro del if de goles");
        }
        else if(tipo === "asistencias"){
            jugSeleccionado.estadisticas.asistencias += 1;
        }

        console.log("llega después de simular los datos de un juagdor");
        jugSeleccionado.estadisticas.partidosJugados += 1;
        await jugSeleccionado.estadisticas.save();
        console.log("ha guardado en el campo estadisticas");
        
    }


}
/**
 * Función privada para crear una nueva tabla de clasificacion de la nueva jornada
 * @param {Array} nuevaClasificacion - Campo de tabla de ClasificacionModel 
 * @param {Array} partido - Objeto que guarda la posicion de cada equipo en la tabla
 * @param {Array} equipoLocal - EquipoLocal
 * @param {Array} equipoVisitante - EquipoVisitante
 */
const actualizarClasificacion = (nuevaClasificacion, partido, equipoLocal, equipoVisitante) => {
    const local = nuevaClasificacion.tabla.find(e => e.equipoPosicion.equals(equipoLocal));
    const visitante = nuevaClasificacion.tabla.find(e => e.equipoPosicion.equals(equipoVisitante));

    local.estadisticas.partidosJugados += 1;
    visitante.estadisticas.partidosJugados += 1;

    local.estadisticas.golesAFavor += partido.golesLocal;
    local.estadisticas.golesEnContra += partido.golesVisitante;
    local.estadisticas.diferenciaGoles += (partido.golesLocal - partido.golesVisitante);

    visitante.estadisticas.golesAFavor += partido.golesVisitante;
    visitante.estadisticas.golesEnContra += partido.golesLocal;
    visitante.estadisticas.diferenciaGoles += (partido.golesVisitante - partido.golesLocal);

    if (partido.golesLocal > partido.golesVisitante) {
        local.estadisticas.victorias += 1;
        local.estadisticas.puntos += 3;
        visitante.estadisticas.derrotas += 1;
    } else if (partido.golesLocal < partido.golesVisitante) {
        visitante.estadisticas.victorias += 1;
        visitante.estadisticas.puntos += 3;
        local.estadisticas.derrotas += 1;
    } else {
        local.estadisticas.empates += 1;
        visitante.estadisticas.empates += 1;
        local.estadisticas.puntos += 1;
        visitante.estadisticas.puntos += 1;
    }
}