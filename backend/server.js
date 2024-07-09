import express, { urlencoded } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/routesUsuarios.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use("/api/usuarios", router);

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

/*app.listen(PORT, () => {
    connectDB(MONGO_URI)
    console.log("¡Conectado a MongoDB!");
    console.log(`Servidor corriendo en la URL http://localhost:${PORT}`);
    })*/

const start = async () => {
    try {
        await connectDB(MONGO_URI);
        console.log("¡Conectado a MongoDB!");
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en la URL http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
