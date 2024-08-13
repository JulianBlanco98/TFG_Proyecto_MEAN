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
    rol: {
        type: String,
        enum: ['admin', 'usuario'],
        default: 'usuario',
    },
    predicciones : [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'predicciones',
    }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserModel = mongoose.model("user", usuarioSchema);
