import mongoose from "mongoose";

const prediccionSchema = new mongoose.Schema(
    {
        idUsuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        numeroJornada: {
            type: Number,
            required: [true, "Por favor, completa este campo"],
        },
        monedaInicial: {
            type: Number,
            required: [true, "Por favor, completa este campo"],
        },
        ganado: {
            type: Boolean,
            default: false,
        },
        tipo_1: [
            {
                indicePartido: {
                    type: Number,
                    required: [true, "Por favor, completa este campo"],
                },
                prediGanador: {
                    type: String,
                    required: [true, "Por favor, completa este campo"],
                },
                cantidad: {
                    type: Number,
                    required: [true, "Por favor, completa este campo"],
                },
            },
        ],
        tipo_2: [
            {
                idEquipo: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "equipos",
                    required: true,
                },
                goles: {
                    type: Number,
                    required: [true, "Por favor, completa este campo"],
                },
                cantidad: {
                    type: Number,
                    required: [true, "Por favor, completa este campo"],
                },
            },
        ],
        tipo_3: [
            {
                idEquipo: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "equipos",
                    required: true,
                },
                asistencias: {
                    type: Number,
                    required: [true, "Por favor, completa este campo"],
                },
                cantidad: {
                    type: Number,
                    required: [true, "Por favor, completa este campo"],
                },
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const PrediccionModel = mongoose.model("predicciones", prediccionSchema);
