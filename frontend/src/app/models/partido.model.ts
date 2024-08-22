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
        portero: {
            jugador: string;
            imagen: string;
            posicion: string;
        },
        defensas: {
            jugador: string;
            imagen: string;
            posicion: string;
            goles: number;
            asistencias: number;
        }[],
        mediocentros: {
            jugador: string;
            imagen: string;
            posicion: string;
            goles: number;
            asistencias: number;
        }[],
        delanteros: {
            jugador: string;
            imagen: string;
            posicion: string;
            goles: number;
            asistencias: number;
        }[],
    },
    titularesVisitante: {
        portero: {
            jugador: string;
            imagen: string;
            posicion: string;
        },
        defensas: {
            jugador: string;
            imagen: string;
            posicion: string;
            goles: number;
            asistencias: number;
        }[],
        mediocentros: {
            jugador: string;
            imagen: string;
            posicion: string;
            goles: number;
            asistencias: number;
        }[],
        delanteros: {
            jugador: string;
            imagen: string;
            posicion: string;
            goles: number;
            asistencias: number;
        }[],
    },
};
