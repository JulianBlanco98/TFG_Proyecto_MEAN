import mongoose from 'mongoose';

const jornadaSchema = new mongoose.Schema(
    {
        numeroJornada: {
            type: Number,
            required: [true, "Por favor, completa este campo"],
        },
        jugado: {
            type: Boolean,
            default: false,
        },
        partidos: [{
            equipoLocal: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'equipos',
                required: [true, "Por favor, completa este campo"],
            },
            equipoVisitante: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'equipos',
                required: [true, "Por favor, completa este campo"],
            },
            golesLocal: {
                type: Number,
                default: 0,
            },
            golesVisitante: {
                type: Number,
                default: 0,
            }
        }]
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const JornadaModel = mongoose.model('jornada', jornadaSchema);
