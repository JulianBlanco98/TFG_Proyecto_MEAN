import mongoose from "mongoose";

//Esquema para representar la colección de usuario
const usuarioSchema = new mongoose.Schema(
  {
    datos: {
      nombre: {
        type: String,
        required: [true, "Por favor, completa este campo"],
      },
      edad: {
        type: Number,
        required: [true, "Por favor, completa este campo"],
      },
      correo: {
        type: String,
        required: [true, "Por favor, completa este campo"],
      },
      password: {
        type: String,
        required: [true, "Por favor, completa este campo"],
      },
    },
    moneda: {
      type: Number,
      default: 1000, //Saldo por defecto a la hora de registrarse
    },
    apuestas: {
      apuesta_1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quinielas",
        required: false, //cambiar a true cuando tenga las apuestas
    },
    apuesta_2: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "comunio",
          required: false, //cambiar a true cuando tenga las apuestas
      }
    },
    rol: {
        type: String,
        enum: ['admin', 'usuario'],
        default: 'usuario',
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserModel = mongoose.model("user", usuarioSchema);
