export interface Entrenador {
    _id: string
  idEquipo: string,
  idApiEquipo: number,
  coloresEquipo: string[],
  datos: {
    nombreEntrenador: string,
    fechaNacimiento: string,
    nacionalidad: string,
    paisNacimiento: string,
    imagenEntrenador: string,
  };
}
