export interface Jornada {
    _id: string;
    numeroJornada: number;
    jugado: boolean;
    partidos: {
        equipoLocal: {
            _id: string;
            nombreEquipoCorto: string;
            escudoEquipo: string;
        };
        equipoVisitante: {
            _id: string;
            nombreEquipoCorto: string;
            escudoEquipo: string;
        };
        golesLocal: number;
        golesVisitante: number;
    }[];
}

