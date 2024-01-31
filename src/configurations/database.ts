import mongoose from "mongoose";
import { Player } from "../models/index.js";


class Database {
    constructor() {
        (async () => {
            try {
                const { MONGO_USERNAME, MONGO_PASSWORD } = process.env
                const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@pragma.aninhds.mongodb.net/?retryWrites=true&w=majority`;
                await mongoose.connect(uri, { dbName: "planning-poker" });

                console.log("Base de datos conectada! 🎉🎉");


                if (process.env.ENVIROMENT === "DEV") {
                    await Player.deleteMany();
                    //WHEN THE APP RESETS, THE CLIENTS/SOCKETS WITH CONNECTIONS LOSES AND DONT DISCONNECT BY ITSELF
                }

            } catch (error) {
                console.log("Ocurrió un error al conectar en la base de datos");
            }
        })()
    }
}

export default Database;