import jwt from "jsonwebtoken";

export const autenticarToken = (req, res, next) => {

    // console.log(req.headers);
    // console.log("Estoy en autenticar, antes de createPremios");
    
    const token = req.headers['authorization'];
    if(!token){
        return res.status(401).json({message: 'Token no proporcionado'})
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, usuario) => {
        if(err){
            return res.status(403).json({message: 'Token invalido'});
        }

        req.usuario = usuario;
        next();
    });
};


