import mongoose from "mongoose";

//Esquema para representar la colección de usuario
const usuarioSchema = new mongoose.Schema(
  {
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
    saldo: {
      type: Number,
      default: 1000, //Saldo por defecto a la hora de registrarse
      required: [true, "Por favor, completa este campo"],
    },
    password: {
      type: String,
      required: [true, "Por favor, completa este campo"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//Modelo (clase base) a partir del schema
export const UsuarioModel = mongoose.model("usuario", usuarioSchema);
