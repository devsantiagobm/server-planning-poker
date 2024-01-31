import dotenv from "dotenv"
import Server from "./configurations/server.js"
import Database  from "./configurations/database.js"

dotenv.config()
new Server()
new Database()