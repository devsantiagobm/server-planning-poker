import express, { Application } from "express"
import http, { Server as HttpServer } from "node:http"
import { Server as SocketServer } from "socket.io"
import { classroomRouter } from "../routes/index.js"
import { socketsController } from "../controllers/sockets.controller.js"
import cors, { CorsOptions } from "cors"

export default class Server {
    app: Application;
    io: SocketServer;
    httpServer: HttpServer;
    CLIENTS_URL = process.env.CLIENTS_URL?.split(",");

    constructor() {
        this.app = express()
        this.httpServer = http.createServer(this.app);
        this.io = new SocketServer(this.httpServer, {
            cors: {
                origin: this.CLIENTS_URL
            }
        })

        this.middlewares()
        this.services()
        this.httpServer.listen(process.env?.PORT ?? 8080)
    }

    services() {
        this.sockets();
        this.routes()
    }
    middlewares() {
        this.app.use(cors({
            origin:  (origin, callback) => {
                if (origin && this.CLIENTS_URL && this.CLIENTS_URL.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            }
        }))
        this.app.use(express.json())

    }

    routes() {
        this.app.use("/classroom", classroomRouter)
    }

    sockets() {
        this.io.on("connection", (socket) => socketsController(socket, this.io));
    }
}