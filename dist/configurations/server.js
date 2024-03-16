import express from "express";
import http from "node:http";
import { Server as SocketServer } from "socket.io";
import { classroomRouter } from "../routes/index.js";
import { socketsController } from "../controllers/sockets.controller.js";
import cors from "cors";
export default class Server {
    constructor() {
        var _a, _b, _c;
        this.CLIENTS_URL = (_a = process.env.CLIENTS_URL) === null || _a === void 0 ? void 0 : _a.split(",");
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.io = new SocketServer(this.httpServer, {
            cors: {
                origin: this.CLIENTS_URL
            }
        });
        this.middlewares();
        this.services();
        this.httpServer.listen((_c = (_b = process.env) === null || _b === void 0 ? void 0 : _b.PORT) !== null && _c !== void 0 ? _c : 8080);
    }
    services() {
        this.sockets();
        this.routes();
    }
    middlewares() {
        this.app.use(cors({
            origin: (origin, callback) => {
                if (origin && this.CLIENTS_URL && this.CLIENTS_URL.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'));
                }
            }
        }));
        this.app.use(express.json());
    }
    routes() {
        this.app.use("/classroom", classroomRouter);
    }
    sockets() {
        this.io.on("connection", (socket) => socketsController(socket, this.io));
    }
}
//# sourceMappingURL=server.js.map