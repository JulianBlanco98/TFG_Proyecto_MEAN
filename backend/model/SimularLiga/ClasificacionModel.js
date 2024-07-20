import mongoose, { Mongoose } from "mongoose";

const clasificacionSchema = new mongoose.Schema(
    {
        tabla: [{
            _id: false,
            posicion: {
                type: Number,
                required: [true, "Por favor, completa este campo"],
            },
            equipoPosicion: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'equipos',
                required: [true, "Por favor, completa este campo"],
            },
            estadisticas: {
                _id: false,
                partidosJugados: {
                    type: Number,
                    default: 0,
                },
                victorias: {
                    type: Number,
                    default: -1,
                },
                derrotas: {
                    type: Number,
                    default: -1,
                },
                empates: {
                    type: Number,
                    default: -1,
                },
                puntos: {
                    type: Number,
                    default: 0,
                },
                golesAFavor: {
                    type: Number,
                    default: 0,
                },
                golesEnContra: {
                    type: Number,
                    default: 0,
                },
                diferenciaGoles: {
                    type: Number,
                    default: 0,
                },
            }
        }]
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const ClasificacionModel = mongoose.model('clasificacion', clasificacionSchema);