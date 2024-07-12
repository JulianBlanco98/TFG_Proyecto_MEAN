import mongoose from "mongoose";

const premiosSchema = new mongoose.Schema(
  {
    nombrePremio: {
      type: String,
      required: [true, "Por favor, completa este campo"],
    },
    imagenPremio: {
      type: String,
      required: [true, "Por favor, completa este campo"],
    },
    saldoPremio: {
      type: Number,
      required: [true, "Por favor, completa este campo"],
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const PremioModel = mongoose.model("premio", premiosSchema);
