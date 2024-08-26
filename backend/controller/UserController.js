import { UserModel } from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Registrar un usuario
export const registrarUsuario = async (req, res) => {
    const { nombre, edad, correo, password } = req.body;
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
    const { nombre, password } = req.body;

    try {
        //console.log("parametros login: ", req.body);
        const usuario = await UserModel.findOne({ "datos.nombre": nombre });
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

export const getUsuariodatos = async (req, res) => {

    //console.log("GetUsuarioId en el back");
    try {
        const {id} = req.params;
        //console.log("IdUsario en el back de getUsuario: ", id);
        const usuario = await UserModel.findById(id);
        if(!usuario){
            res.status(404).json({message: "Usuario no encontrado"})
        }
        res.status(200).json(usuario)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
export const updateUsuarios = async (req, res) => {
    try {
        console.log("Estoy en actualizar usuarios");

        const { id } = req.params;
        console.log(req.body);

        let actualizarDatos = {
            'datos.nombre': req.body.nombre,
            'datos.edad': req.body.edad,
            'moneda': req.body.moneda,
            'datos.correo': req.body.correo,
        };

        if (req.body.password) {
            const encriptarPassword = await bcrypt.hash(req.body.password, 10);
            actualizarDatos['datos.password'] = encriptarPassword;
        }

        const usuario = await UserModel.findOneAndUpdate(
            { _id: id },
            actualizarDatos,
            { new: true }
        );

        res.status(200).json({ message: "usuario actualizado correctamente", usuario: usuario });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const editarUsuario = async (req, res) => {
    try {
        console.log("Estoy en editarUsuario");

        const id = req.usuario.id;
        console.log("back de editar usuario. ID: ", id);
        console.log(req.body);

        let actualizarDatos = {
            'datos.nombre': req.body.nombre,
            'datos.edad': req.body.edad,
            'datos.correo': req.body.correo,
        };

        if (req.body.password) {
            const encriptarPassword = await bcrypt.hash(req.body.password, 10);
            actualizarDatos['datos.password'] = encriptarPassword;
        }

        const usuario = await UserModel.findOneAndUpdate(
            { _id: id },
            actualizarDatos,
            { new: true }
        );

        res.status(200).json({ message: "usuario actualizado correctamente", usuario: usuario });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await UserModel.find()
        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
export const createUsuarioAdmin = async (req, res) => {
    const { nombre, edad, correo, password } = req.body;
    try {
        //Verificar que no hay un usuario con el mismo nombre
        const usuarioExiste = await UserModel.findOne({ "datos.nombre": nombre });
        
        if (usuarioExiste) {
            return res.status(400).json({
                message: "Ya existe un usuario con este nombre",
                type: "danger",
            });
        }
        //console.log("No existe. Continua");
        //Encriptar la contra con 10 saltos (estándar)
        const encriptarPassword = await bcrypt.hash(password, 10);

        const newUsuario = new UserModel({
            datos: { nombre, edad, correo, password: encriptarPassword },
            rol: "usuario",
        });
        //console.log(newUsuario);
        await newUsuario.save();

        res.status(201).json({
            message: "Usuario registrado con éxito por el admin",
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
}

export const deleteUsuarios = async (req, res) => {
    try {
        const {id} = req.params
        const usuario = await UserModel.findByIdAndDelete(id)
        if(!usuario){
            return res.status(404).json(`El usuario con id: ${id} no se ha encontrado`)
        }
        res.status(200).json({message: "Usuario borrado perfectamente"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
export const getMonedaUsuarioById = async (req, res) => {

    try {
        //const usuarioId = req.usuario.id;
        const {id} = req.params
        const usuario = await UserModel.findById(id);
        if(!usuario){
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        res.status(200).json({moneda: usuario.moneda})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
