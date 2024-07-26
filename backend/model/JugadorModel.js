import mongoose from "mongoose";

const jugadoresSchema = new mongoose.Schema(
  {
    idEquipo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'equipos',
      required: true,
    },
    idApiEquipo: {
      type: Number,
      required: true,
    },
    coloresEquipo: { 
      type: [String], 
      required: false, 
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
        required: [true, "Por favor, completa este campo"],
      },
      paisNacimiento: {
        type: String,
        required: [true, "Por favor, completa este campo"],
      },
      imagenJugador: {
        type: String,
        required: [true, "Por favor, completa este campo"],
      }
    },
    estadisticas: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'estadisticas',
      required: [true, "Por favor, completa este campo"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const JugadorModel = mongoose.model('jugadores', jugadoresSchema);