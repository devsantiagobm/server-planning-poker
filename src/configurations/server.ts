import express, { Application } from "express"
import http, { Server as HttpServer } from "node:http"
import { Server as SocketServer } from "socket.io"
import { classroomRouter } from "../routes/index.js"
import { socketsController } from "../controllers/sockets.controller.js"
import cors from "cors"

export default class Server {
    app: Application;
    io: SocketServer;
    httpServer: HttpServer;

    constructor() {
        this.app = express()
        this.httpServer = http.createServer(this.app);
        this.io = new SocketServer(this.httpServer, {
            cors: {
                origin: process.env.CLIENT_URL
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
        this.app.use(express.json())
        this.app.use(cors({
            origin: process.env.CLIENT_URL
        }))
    }

    routes() {
        this.app.use("/classroom", classroomRouter)
    }

    sockets() {
        this.io.on("connection", (socket) => socketsController(socket, this.io));
    }
}