import { UserModel } from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Registrar un usuario
export const registrarUsuario = async (req, res) => {
    const { datos: { nombre, edad, correo, password } } = req.body;
    console.log("Metodo de registro de usuario");
    //console.log(req.body);
    try {
        //Verificar que no hay un usuario con el mismo nombre
        const usuarioExiste = await UserModel.findOne({ "datos.nombre": nombre });
        
        if (usuarioExiste) {
            return res.status(400).json({
                message: "Ya existe un usuario con este nombre",
                type: "danger",
            });
        }
        console.log("No existe. Continua");
        //Encriptar la contra con 10 saltos (estándar)
        const encriptarPassword = await bcrypt.hash(password, 10);

        const newUsuario = new UserModel({
            datos: { nombre, edad, correo, password: encriptarPassword },
            rol: "usuario",
        });
        //console.log(newUsuario);
        await newUsuario.save();

        res.status(201).json({
            message: "Usuario registrado con éxito",
            type: "success",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al registrar el usuario",
            type: "danger",
            err: error,
        });
        console.error(error);
    }
};

//Login de un usuario
export const loginUsuario = async (req, res) => {
    const { nombreUsuario, password } = req.body;

    try {
        const usuario = await UserModel.findOne({ "datos.nombre": nombreUsuario });
        if (!usuario) {
            return res.status(404).json({
                message: "Usuario no encontrado",
                type: "danger",
            });
        }
        const validarPassword = await bcrypt.compare(
            password,
            usuario.datos.password
        );
        if (!validarPassword) {
            return res.status(400).json({
                message: "Contraseña incorrecta",
                type: "danger",
            });
        }

        //Aquí, el usuario es correcto. Creo el token aqui
        const token = jwt.sign(
            {
                id: usuario._id,
                rol: usuario.rol,
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "1h",
            }
        );

        res.status(200).json({
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.datos.nombre,
                rol: usuario.rol
            },
            message: `Bienvenido ${usuario.datos.nombre}!`,
            type: "success"

        });

    } catch (error) {
        res.status(500).json({
            message: 'Error al iniciar sesión',
            error,
            type: 'danger'
        });
    }
};
