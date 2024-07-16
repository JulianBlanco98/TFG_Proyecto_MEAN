import mongoose from "mongoose";

const equiposSchema = new mongoose.Schema(
  {
    nombreEquipo: {
      type: String,
      required: [true, "Por favor, completa este campo"],
    },
    nombreEquipoCorto: {
      type: String,
      required: [true, "Por favor, completa este campo"],
    },
    escudoEquipo: {
      type: String,
      required: [true, "Por favor, completa este campo"],
    },
    direccionEquipo: {
      type: String,
      required: [true, "Por favor, completa este campo"],
    },
    webEquipo: {
      type: String,
      required: [true, "Por favor, completa este campo"],
    },
    anoFundacionEquipo: {
      type: Number,
      required: [true, "Por favor, completa este campo"],
    },
    coloresEquipos: {
      type: String,
      required: [true, "Por favor, completa este campo"],
    },
    estadioEquipo: {
      type: String,
      required: [true, "Por favor, completa este campo"],
    },
    idEquipoAPI: {
      type: Number,
      required: [true, "Por favor, completa este campo"],
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const EquiposModel = mongoose.model("equipos", equiposSchema)
