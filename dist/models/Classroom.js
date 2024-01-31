import { Schema, model } from "mongoose";
export const Classroom = model("classroom", new Schema({
    name: String,
    owners: [String],
    typeOfScores: String
}));
//# sourceMappingURL=Classroom.js.map