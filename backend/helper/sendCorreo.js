import { error } from 'console';
import pkg from 'nodemailer';
const { createTransport } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';
import { EquiposModel } from '../model/EquiposModel.js'


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
export const historicoJornadaActual = async (usuario, prediccion, totalMonedas) => {

    try{
        // Paso 1: Obtener todos los IDs de equipos mencionados en las predicciones
        const equipoIds = [];
    
        // Recopilar ids de tipo_2
        prediccion.tipo_2.forEach(tipo2 => {
            equipoIds.push(tipo2.idEquipo);
        });
    
        // Recopilar ids de tipo_3
        prediccion.tipo_3.forEach(tipo3 => {
            equipoIds.push(tipo3.idEquipo);
        });

        console.log("IDs de equipos a buscar:", equipoIds);
    
        // Paso 2: Consultar la base de datos para obtener los nombres de los equipos
        const equipos = await EquiposModel.find({
            _id: { $in: equipoIds }
        }).select('nombreEquipo');

        console.log("Equipos encontrados:", equipos)
    
        // Crear un mapa de ID a nombre
        const equipoNombreMap = {};
        equipos.forEach(equipo => {
            equipoNombreMap[equipo._id.toString()] = equipo.nombreEquipo;
        });

        console.log("Mapa de nombres de equipos:", equipoNombreMap);
    
    
        let resumenTipo1 = '';
        let resumenTipo2 = '';
        let resumenTipo3 = '';
    
        if(prediccion.tipo_1 && prediccion.tipo_1.length > 0){
            resumenTipo1 = `<h3 style="color: black;">Quiniela (Local, Empate, Visitante)</h3><ul>`;
            prediccion.tipo_1.forEach((tipo1) => {
                resumenTipo1 += `<li>
                                    Partido ${tipo1.indicePartido+1}: Predicción - ${tipo1.prediGanador},
                                    Multiplicador: ${tipo1.multiPrediccion},
                                    Monedas apostadas: ${tipo1.cantidad},
                                    Resultado: ${tipo1.isGanada ? 'Ganaste' : 'Perdiste'}
                
                                </li>`;
            });
            resumenTipo1 += '</ul>'
        }
        if(prediccion.tipo_2 && prediccion.tipo_2.length > 0){
            resumenTipo2 = `<h3 style="color: black;">Predicciones de Goles: </h3><ul>`;
            prediccion.tipo_2.forEach((tipo2) => {
                const equipoNombre = equipoNombreMap[tipo2.idEquipo];
                resumenTipo2 += `<li>
                                    Equipo: ${equipoNombre},
                                    Predicción Goles: ${tipo2.goles},
                                    Monedas apostadas: ${tipo2.cantidad},
                                    Resultado: ${tipo2.isGanada ? 'Ganaste' : 'Perdiste'} 
                                </li>`;
            });
            resumenTipo2 += '</ul>'
        }
        if(prediccion.tipo_3 && prediccion.tipo_3.length > 0){
            resumenTipo3 = `<h3 style="color: black;">Predicciones de Asistencias: </h3><ul>`;
            prediccion.tipo_3.forEach((tipo3) => {
                const equipoNombre = equipoNombreMap[tipo3.idEquipo];
                resumenTipo3 += `<li>
                                    Equipo: ${equipoNombre},
                                    Predicción Asistencias: ${tipo3.asistencias},
                                    Monedas apostadas: ${tipo3.cantidad},
                                    Resultado: ${tipo3.isGanada ? 'Ganaste' : 'Perdiste'} 
                                </li>`;
            });
            resumenTipo3 += '</ul>'
        }
    
    
        let mail = {
            from: "laligastats.tfg@gmail.com",
            to: `${usuario.datos.correo}`,
            subject: `Resumen de las predicciones de la jornada ${prediccion.numeroJornada}`,
            html: `
                <h2 style="color: black;">Bienvendio ${usuario.datos.nombre} al correo de resumen de tus predicciones de la última jornada</h2>
                <p style="color: black;">A continuación, te mostraremos un resumen de tus predicciones: </p>
                ${resumenTipo1}
                ${resumenTipo2}
                ${resumenTipo3}
                <hr>
                <p style="color: black;">Monedas iniciales:        <strong>${prediccion.monedaInicial}</strong> monedas</p>
                <p style="color: black;">Total de monedas jugadas: <strong>${totalMonedas}</strong> monedas</p>
                <p style="color: black;">Total de monedas ganadas: <strong>${prediccion.monedasGanadas}</strong> monedas</p>
                <p style="color: black;">Resultado final: ${prediccion.ganado ? 'Has salido ganador de esta jornada' : 'No has ganado esta jornada. Intentálo en la próxima'}
            `
        };
    
        trasporter.sendMail(mail, (error, info) => {
            if(error) {
                console.error("Error de envio: ", error)
            }
            else{
                console.log("Correo histórico enviado con éxito");
            }
        })

    }
    catch(error) {
        console.error("Error al generar el correo histórico: ", error);
    }
}

