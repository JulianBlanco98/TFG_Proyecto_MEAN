import pkg from 'nodemailer';
const { createTransport } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const trasporter = createTransport({
    host: "smtp.gmail.com",
    port: "465",
    secure: true,
    auth: {
        user: "laligastats.tfg@gmail.com",
        pass: "jflm wxfc qcte dndz"
    }
});

export const premioCanjear = async (usuario, premio) => {


    const imagePath = path.resolve(__dirname, '../../frontend/src' + premio.imagenPremio);
    console.log("Path absoluto de la imagen: ", imagePath);

    let mail = {
        from: "laligastats.tfg@gmail.com",
        to: "lojoto2177@polatrix.com",
        subject: "¡HAS CANJEADO UN PREMIO!",
        html: `
            <h2>Hola ${usuario.datos.nombre}</h2>
            <p>Felicidades por haber conseguido suficientes monedas para canjear el siguiente premio: </p>
            <img src="cid:imagenPremio" style="max-width: 300px; height: auto; object-fit: contain;">
            <p><strong>${premio.nombrePremio}</strong> (<i>${premio.saldoPremio} monedas</i>)<p>
            <p><i>Clave del producto: XXXX - XXXX - XXXX</i></p>
            <p>
                Tenías ${usuario.moneda} monedas y te has quedado con <strong>${(usuario.moneda - premio.saldoPremio)}</strong> monedas.
                Un abrazo ${usuario.datos.nombre} y esperamos que sigas disfrutando de <strong>LaLigaStats!!</strong>
            </p>
        `,
        attachments: [
            {
                filename: 'imagenPremio.jpg',
                path: imagePath, // Ajusta la ruta según sea necesario
                cid: 'imagenPremio' // Este es el ID que se usará para referenciar la imagen en el contenido HTML
            }
        ]
    };

    trasporter.sendMail(mail, (error, info) => {
        if(error) {
            console.error("Error de envio: ",error);
        }
        else{
            console.log("Correo enviado con exito");
        }
    })
}

