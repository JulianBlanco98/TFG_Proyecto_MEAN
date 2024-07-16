import mongoose from "mongoose";

const jugadoresSchema = new mongoose.Schema(
  {
    idEquipo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'equipos',
      required: true,
    },
    nombreEquipo: {
      type: String,
      required: [true, "Por favor, completa este campo"],
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
        type: String,
        required: [true, "Por favor, completa este campo"],
      },
      nacionalidad: {
        type: String,
        required: [true, "Por favor, completa este campo"],
      },
      dorsal: {
        type: Number,
        default: -1,
      },
      valorMercado: {
        type: Number,
        default: -1,
      },
    },
    estadisticas: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'estadisticas'
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const JugadorModel = mongoose.model('jugadores', jugadoresSchema);