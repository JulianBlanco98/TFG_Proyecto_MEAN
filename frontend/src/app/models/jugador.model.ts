export interface Jugador {
  _id: string;
  idEquipo: string;
  nombreEquipo: string;
  datos: {
    nombreJugador: string;
    posicion: string;
    fechaNacimiento: string;
    nacionalidad: string;
    dorsal: number;
    valorMercado: number;
  };
  estadisticas: string;
}
