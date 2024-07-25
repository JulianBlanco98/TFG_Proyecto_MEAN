import { JornadaModel } from "../model/SimularLiga/JornadaModel.js";
import { EquiposModel } from "../model/EquiposModel.js";
import randomNumber from 'random-number-csprng'


export const getJornadaByNumero = async (req,res) => {

    try {
        const {numero} = req.params
        console.log("Parametro del numero de jornada: ", numero);
        const jornada = await JornadaModel.findOne({numeroJornada: numero})
        .populate('partidos.equipoLocal', 'nombreEquipoCorto escudoEquipo')
        .populate('partidos.equipoVisitante', 'nombreEquipoCorto escudoEquipo');

        if(!jornada){
            return res.status(400).json(`Esta jornada no existe`)
        }

        return res.status(200).json(jornada)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
//Put, ya que voy a actualizar los datos de jornada
export const simularJornadaActual = async (req, res) => {

    try {
        let jornadaActual = await JornadaModel.find({jugado: false});
        if(!jornadaActual){
            return res.status(404).json({message: "Todas las jornadas se han jugado ya"})
        }
        console.log("Numero de jornada a simular: ",jornadaActual.numeroJornada);
        //Generar los goles de manera aleatoria
        const promesas = jornadaActual.partidos.map(async partido => {
            partido.golesLocal = await randomNumber(0, 6);
            partido.golesVisitante = await randomNumber(0, 6);
        });

        jornadaActual.jugado = true;
        await jornadaActual.save();

        res.status(200).json({message: 'Jornada simulada con éxito', jornada: jornadaActual})

    } catch (error) {
        res.status(500).json({message: 'Error al simular la jornada', error})
    }

} 