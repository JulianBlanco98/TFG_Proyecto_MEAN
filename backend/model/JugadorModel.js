import mongoose from "mongoose";

const jugadoresSchema = new mongoose.Schema(
  {
    equipo: {
      idEquipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipo',
        required: true,
      },
      nombreEquipo: {
          type: String,
          required: [true, "Por favor, completa este campo"],
      },
      equipoJugador: {
        type: String,
        required: [true, "Por favor, completa este campo"],
      },
      escudo: {
        type: String,
        required: [true, "Por favor, completa este campo"],
      },
    },
    datos: {
      nombreJugador: {
        type: String,
        required: [true, "Por favor, completa este campo"],
      },
      posicion: {
        type: String,
        required: [true, "Por favor, completa este campo"],
      },
      fechaNacimiento: {
        type: Date,
        required: [true, "Por favor, completa este campo"],
      },
      nacionalidad: {
        type: String,
        required: [true, "Por favor, completa este campo"],
      },
    },
    estadisticas: {
      goles: {
        type: Number,
        default: 0,
      },
      asistencias: {
        type: Number,
        default: 0,
      },
      partidosJugados: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//export default mongoose.model('Jugador', jugadoresSchema);
