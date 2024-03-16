var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Classroom, Player } from "../models/index.js";
import { Types } from "mongoose";
export function socketsController(socket, io) {
    socket.on("join-classroom", function (data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(data);
                const { roomID } = data;
                if (!Types.ObjectId.isValid(roomID)) {
                    io.to(socket.id).emit("error", { message: "Ups! Parece que el id no es válido" });
                    return;
                }
                let classroom = yield Classroom.findById(roomID);
                if (!classroom) {
                    io.to(socket.id).emit("error", { message: "Ups! Parece que el id no es válido" });
                }
                const oldPlayers = yield Player.find({ roomID });
                if (oldPlayers.length >= 8) {
                    io.to(socket.id).emit("match-full", { message: "Parece que esta sala está llena. Intenta más tarde" });
                    return;
                }
                if (oldPlayers.length === 0) {
                    classroom = yield Classroom.findOneAndUpdate({ _id: roomID }, { $set: { owners: [socket.id] } }, { new: true });
                }
                const newPlayer = yield new Player(Object.assign(Object.assign({}, data), { socketID: socket.id })).save();
                socket.join(roomID);
                const players = [...oldPlayers, newPlayer];
                io.to(roomID).emit("join-classroom", { classroom, players });
            }
            catch (error) {
                console.log(error);
            }
        });
    });
    socket.on("reveal-cards", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const player = yield Player.findOne({ socketID: socket.id });
            if (!player)
                throw new Error("User not found");
            const { roomID } = player;
            const playersInRoom = yield Player.find({ roomID, type: "player" });
            const playersThatVotedNumbers = playersInRoom.filter(({ vote }) => /^\d+$/.test(vote));
            const averageWithDecimals = playersThatVotedNumbers.reduce((acum, { vote }) => acum + Number(vote), 0) / playersThatVotedNumbers.length;
            const average = String(isNaN(averageWithDecimals) ? 0 : parseFloat(averageWithDecimals.toFixed(1)));
            const votedCards = {};
            playersInRoom.forEach(({ vote }) => votedCards[vote] ? votedCards[vote] = votedCards[vote] + 1 : votedCards[vote] = 1);
            const amountOfVotes = Object.entries(votedCards).map(([label, times]) => ({ label, times }));
            io.to(roomID).emit("reveal-cards", { average, amountOfVotes });
        });
    });
    socket.on("vote", function ({ card }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const player = yield Player.findOneAndUpdate({ socketID: socket.id }, { vote: card });
                if (!player)
                    throw new Error("Usuario no encontrado");
                const { roomID } = player;
                const players = yield Player.find({ roomID });
                io.to(roomID).emit("update-classroom", { players });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                }
            }
        });
    });
    socket.on("reset-classroom", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const player = yield Player.findOne({ socketID: socket.id });
            if (!player)
                throw new Error("Usuario no encontrado");
            const { roomID } = player;
            yield Player.updateMany({ roomID }, { vote: null });
            const players = yield Player.find({ roomID });
            io.to(roomID).emit("reset-classroom", { players });
        });
    });
    socket.on("update-player", function ({ type }) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = yield Player.findOneAndUpdate({ socketID: socket.id }, { type, vote: null });
            if (!player)
                throw new Error("Usuario no encontrado");
            const { roomID } = player;
            const players = yield Player.find({ roomID });
            io.to(roomID).emit("update-player", { players });
        });
    });
    socket.on("add-admin", function ({ socketID }) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = yield Player.findOne({ socketID });
            if (!player)
                throw new Error("User not found");
            const { roomID } = player;
            const classroom = yield Classroom.findOneAndUpdate({ _id: roomID }, { $addToSet: { owners: socketID } }, { new: true });
            const players = yield Player.find({ roomID });
            io.to(roomID).emit("add-admin", { players, classroom });
        });
    });
    socket.on("change-type-of-score", function ({ typeOfScores }) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = yield Player.findOne({ socketID: socket.id });
            if (!player)
                throw new Error("User not found");
            const { roomID } = player;
            yield Player.updateMany({ roomID }, { vote: null });
            const players = yield Player.find({ roomID });
            const classroom = yield Classroom.findOneAndUpdate({ _id: roomID }, { typeOfScores }, { new: true });
            io.to(roomID).emit("change-type-of-score", { players, classroom });
        });
    });
    socket.on("disconnect", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const player = yield Player.findOneAndDelete({ socketID: socket.id });
            if (!player)
                return;
            const { roomID } = player;
            const players = yield Player.find({ roomID });
            let classroom = yield Classroom.findById(player.roomID);
            if (!classroom)
                throw new Error("classroom not found");
            classroom.owners = classroom.owners.filter(owner => socket.id !== owner);
            // If the admin goes out and theres people in the room:
            if (classroom.owners.length === 0 && players.length > 0) {
                classroom = yield Classroom.findOneAndUpdate({ _id: roomID }, { $set: { owners: [players[0].socketID] } }, { new: true });
            }
            io.to(roomID).emit("player-disconnected", { players, classroom });
        });
    });
}
//# sourceMappingURL=sockets.controller.js.map