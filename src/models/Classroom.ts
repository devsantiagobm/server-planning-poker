import { Document, Schema, model } from "mongoose";
import { ClassroomI } from "../types/index.js";

interface ClassroomDocument extends ClassroomI, Document { }


export const Classroom = model<ClassroomDocument>("classroom", new Schema<ClassroomDocument>({
    name: String,
    owners: [String],
    typeOfScores: String
}))
