import mongoose from "mongoose";

const entrenadorSchema = new mongoose.Schema(
  {
    idEquipo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "equipos",
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
      nombreEntrenador: {
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
      paisNacimiento: {
        type: String,
        required: [true, "Por favor, completa este campo"],
      },
      imagenEntrenador: {
        type: String,
        required: [true, "Por favor, completa este campo"],
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const EntrenadorModel = mongoose.model("entrenadores", entrenadorSchema);
