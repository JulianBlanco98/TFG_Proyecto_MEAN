export interface Jugador {
  _id: string,
  idEquipo: string,
  idApiEquipo: number,
  coloresEquipo: string[],
  datos: {
    nombreJugador: string,
    posicion: string,
    fechaNacimiento: string,
    nacionalidad: string,
    dorsal: number,
    paisNacimiento: string,
    imagenJugador: string,
  };
  estadisticas: {
    goles: number;
    asistencias: number;
    partidosJugados: number;
  };
  frente: boolean;
}
