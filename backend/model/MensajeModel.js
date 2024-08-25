import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, "Por favor, completa este campo"],
        },
        correo: {
            type: String,
            required: [true, "Por favor, completa este campo"],
        },
        mensaje: {
            type: String,
            required: [true, "Por favor, completa este campo"],
        },
        motivo: {
            type: String,
            required: [true, "Por favor, completa este campo"],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const MensajeModel = mongoose.model("mensajes", mensajeSchema);