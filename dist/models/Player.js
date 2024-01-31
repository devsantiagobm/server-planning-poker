import { Schema, model } from "mongoose";
export const Player = model("player", new Schema({
    username: String,
    type: String,
    socketID: String,
    roomID: String,
    vote: String
}));
//# sourceMappingURL=Player.js.map