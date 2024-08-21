export interface Partido {
    resultado: {
        equipoLocal: {
            escudoEquipo: string;
            nombreEquipoCorto: string;
        },
        equipoVisitante: {
            escudoEquipo: string;
            nombreEquipoCorto: string;
        },
        golesLocal: number,
        golesVisitante: number,
    },
    titularesLocal: {
        jugador: string;
        imagen: string;
        goles: number;
        posicion: string;
        asistencias: number;
    } [],
    titularesVisitante: {
        jugador: string;
        imagen: string;
        goles: number;
        posicion: string;
        asistencias: number;
    } [],
};


