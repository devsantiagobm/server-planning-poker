import { Document, Schema, model } from "mongoose";
import { PlayerI } from "../types/index.js";


interface PlayerDocument extends PlayerI, Document { }

export const Player = model<PlayerDocument>("player", new Schema<PlayerDocument>({
    username: String,
    type: String,
    socketID: String,
    roomID: String,
    vote: String
}))
