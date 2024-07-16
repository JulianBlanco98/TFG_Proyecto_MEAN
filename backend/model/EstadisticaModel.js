import mongoose from "mongoose";

const estadisticasSchema = new mongoose.Schema(
  {
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
  {
    timestamps: true,
    versionKey: false,
  }
);

export const EstadisticasModel = mongoose.model('estadisticas', estadisticasSchema);