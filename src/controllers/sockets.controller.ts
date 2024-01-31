import { Socket, Server as SocketServer } from "socket.io";
import { Classroom, Player } from "../models/index.js";
import { CastError, Types } from "mongoose";

export function socketsController(socket: Socket, io: SocketServer) {


    socket.on("join-classroom", async function (data: JoinMatchata) {
        try {
            const { roomID } = data

            if (!Types.ObjectId.isValid(roomID)) {
                io.to(socket.id).emit("error", { message: "Ups! Parece que el id no es válido" })
                return;
            }

            let classroom = await Classroom.findById(roomID)

            if (!classroom) {
                io.to(socket.id).emit("error", { message: "Ups! Parece que el id no es válido" })
            }


            const oldPlayers = await Player.find({ roomID })

            if (oldPlayers.length >= 8) {
                io.to(socket.id).emit("match-full", { message: "Parece que esta sala está llena. Intenta más tarde" })
                return;
            }

            if (oldPlayers.length === 0) {
                classroom = await Classroom.findOneAndUpdate(
                    { _id: roomID },
                    { $set: { owners: [socket.id] } },
                    { new: true }
                );
            }

            const newPlayer = await new Player({ ...data, socketID: socket.id }).save()

            socket.join(roomID);

            const players = [...oldPlayers, newPlayer]




            io.to(roomID).emit("join-classroom", { classroom, players })

        } catch (error) {

            console.log(error);


        }
    })

    socket.on("reveal-cards", async function () {
        const player = await Player.findOne({ socketID: socket.id })
        if (!player) throw new Error("User not found")

        const { roomID } = player

        const playersInRoom = await Player.find({ roomID, type: "player" })
        const playersThatVotedNumbers = playersInRoom.filter(({ vote }) => /^\d+$/.test(vote))

        const averageWithDecimals = playersThatVotedNumbers.reduce((acum, { vote }) => acum + Number(vote), 0) / playersThatVotedNumbers.length

        const average = String(isNaN(averageWithDecimals) ? 0 : parseFloat(averageWithDecimals.toFixed(1)));

        const votedCards: { [k: string]: number } = {};

        playersInRoom.forEach(({ vote }) => votedCards[vote] ? votedCards[vote] = votedCards[vote] + 1 : votedCards[vote] = 1)
        const amountOfVotes = Object.entries(votedCards).map(([label, times]) => ({ label, times }));

        io.to(roomID).emit("reveal-cards", { average, amountOfVotes })
    })


    socket.on("vote", async function ({ card }: { card: string }) {
        try {
            const player = await Player.findOneAndUpdate({ socketID: socket.id }, { vote: card })
            if (!player) throw new Error("Usuario no encontrado")
            const { roomID } = player

            const players = await Player.find({ roomID })

            io.to(roomID).emit("update-classroom", { players })
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }

    })

    socket.on("reset-classroom", async function () {
        const player = await Player.findOne({ socketID: socket.id })
        if (!player) throw new Error("Usuario no encontrado")
        const { roomID } = player

        await Player.updateMany({ roomID }, { vote: null })
        const players = await Player.find({ roomID })

        io.to(roomID).emit("reset-classroom", { players })
    })


    socket.on("update-player", async function ({ type }: { type: string }) {
        const player = await Player.findOneAndUpdate({ socketID: socket.id }, { type, vote: null })
        if (!player) throw new Error("Usuario no encontrado")
        const { roomID } = player

        const players = await Player.find({ roomID })

        io.to(roomID).emit("update-player", { players })

    })


    socket.on("add-admin", async function ({ socketID }: { socketID: string }) {
        const player = await Player.findOne({ socketID })
        if (!player) throw new Error("User not found")

        const { roomID } = player
        const classroom = await Classroom.findOneAndUpdate({ _id: roomID }, { $addToSet: { owners: socketID } }, { new: true })
        const players = await Player.find({ roomID })

        io.to(roomID).emit("add-admin", { players, classroom })
    })

    socket.on("change-type-of-score", async function ({ typeOfScores }: { typeOfScores: string }) {
        const player = await Player.findOne({ socketID: socket.id })

        if (!player) throw new Error("User not found")

        const { roomID } = player

        await Player.updateMany({ roomID }, { vote: null })
        const players = await Player.find({ roomID })

        const classroom = await Classroom.findOneAndUpdate({ _id: roomID }, { typeOfScores }, { new: true })

        io.to(roomID).emit("change-type-of-score", { players, classroom })
    })

    socket.on("disconnect", async function () {
        const player = await Player.findOneAndDelete({ socketID: socket.id })

        if (!player) return;

        const { roomID } = player
        const players = await Player.find({ roomID })

        let classroom = await Classroom.findById(player.roomID)

        if (!classroom) throw new Error("classroom not found")

        classroom.owners = classroom.owners.filter(owner => socket.id !== owner)

        // If the admin goes out and theres people in the room:
        if (classroom.owners.length === 0 && players.length > 0) {
            classroom = await Classroom.findOneAndUpdate({ _id: roomID }, { $set: { owners: [players[0].socketID] } }, { new: true })
        }

        io.to(roomID).emit("player-disconnected", { players, classroom })
    })

}

interface JoinMatchata {
    roomID: string
    username: string
    type: string
}

