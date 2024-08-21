export interface Prediccion {
    idUsuario: string;
    numeroJornada: number;
    monedaInicial: number;
    monedasGanadas: number;
    jugado: boolean;
    ganado: boolean;
    tipo_1: {
        indicePartido: number;
        prediGanador: string;
        multiPrediccion: number;
        cantidad: number;
        isGanada: boolean;
    }[];
    tipo_2: {
        idEquipo: {
            escudoEquipo: string;
            nombreEquipo: string;
            _id: string;
        };
        goles: number;
        cantidad: number;
        isGanada: boolean;
    }[];
    tipo_3: {
        idEquipo: {
            escudoEquipo: string;
            nombreEquipo: string;
            _id: string;
        };
        asistencias: number;
        cantidad: number;
        isGanada: boolean;
    }[];
    totalMonedas?: number;
}
