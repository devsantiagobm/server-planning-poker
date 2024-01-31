import { Request, Response } from "express"
import { Classroom } from "../models/index.js"

class ClassRoomController {

    async newClassRoom(req: Request, res: Response) {
        try {
            const { body } = req
            const { _id: classRoomId } = await Classroom.create({ ...body, typeOfScores: "fibonacci" })

            return res.status(200).json({ classRoomId })
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message })
            }
        }
    }

    async getClassroom(req: Request, res: Response) {
        try {
            const classroomID = req.headers["x-classroom-id"]
            const classroom = await Classroom.findById(classroomID)

            return res.status(200).json({ classroom })
        } catch (error) {
            if (error instanceof ClassroomNotFound) {
                return res.status(400).json({ error: "Ups! Parece que esta classroom no existe" })
            }
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message })
            }
        }
    }
}

class ClassroomNotFound extends Error {
    constructor() {
        super()
    }
}


export const classRoomController = new ClassRoomController()