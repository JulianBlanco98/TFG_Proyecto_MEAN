import mongoose from "mongoose";

const calendarioSchema = new mongoose.Schema(
    {
        anoCalendario: {
            type: Number,
            required: [true, "Por favor, completa este campo"],
        },
        pais: {
            type: String,
            required: [true, "Por favor, completa este campo"],
        },
        escudoLiga: {
            type: String,
            required: [true, "Por favor, completa este campo"],
        },
        jornadas: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'jornadas'
        }]
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const CalendarioModel = mongoose.model('calendario', calendarioSchema);