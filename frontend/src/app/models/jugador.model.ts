export interface Jugador {
  _id: string,
  idEquipo: string,
  idApiEquipo: number,
  datos: {
    nombreJugador: string,
    posicion: string,
    fechaNacimiento: string,
    nacionalidad: string,
    dorsal: number,
    paisNacimiento: string,
    imagenJugador: string,
  };
  estadisticas: string,
}
