export interface Clasificacion {
    _id: string;
    tabla: {
        posicion: number;
        equipoPosicion: {
            nombreEquipoCorto: string;
            escudoEquipo: string;
        },
        estadisticas: {
            partidosJugados: number;
            victorias: number;
            derrotas: number;
            empates: number;
            puntos: number;
            golesAFavor: number;
            golesEnContra: number;
            diferenciaGoles: number;
        }
    }[];
}
