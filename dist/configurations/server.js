import express from "express";
import http from "node:http";
import { Server as SocketServer } from "socket.io";
import { classroomRouter } from "../routes/index.js";
import { socketsController } from "../controllers/sockets.controller.js";
import cors from "cors";
export default class Server {
    constructor() {
        var _a, _b;
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.io = new SocketServer(this.httpServer, {
            cors: {
                origin: process.env.CLIENT_URL
            }
        });
        this.middlewares();
        this.services();
        this.httpServer.listen((_b = (_a = process.env) === null || _a === void 0 ? void 0 : _a.PORT) !== null && _b !== void 0 ? _b : 8080);
    }
    services() {
        this.sockets();
        this.routes();
    }
    middlewares() {
        this.app.use(express.json());
        this.app.use(cors({
            origin: process.env.CLIENT_URL
        }));
    }
    routes() {
        this.app.use("/classroom", classroomRouter);
    }
    sockets() {
        this.io.on("connection", (socket) => socketsController(socket, this.io));
    }
}
//# sourceMappingURL=server.js.map