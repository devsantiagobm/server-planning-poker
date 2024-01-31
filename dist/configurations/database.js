var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import { Player } from "../models/index.js";
class Database {
    constructor() {
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                const { MONGO_USERNAME, MONGO_PASSWORD } = process.env;
                const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@pragma.aninhds.mongodb.net/?retryWrites=true&w=majority`;
                yield mongoose.connect(uri, { dbName: "planning-poker" });
                console.log("Base de datos conectada! 🎉🎉");
                if (process.env.ENVIROMENT === "DEV") {
                    yield Player.deleteMany();
                    //WHEN THE APP RESETS, THE CLIENTS/SOCKETS WITH CONNECTIONS LOSES AND DONT DISCONNECT BY ITSELF
                }
            }
            catch (error) {
                console.log("Ocurrió un error al conectar en la base de datos");
            }
        }))();
    }
}
export default Database;
//# sourceMappingURL=database.js.map