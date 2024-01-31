var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Classroom } from "../models/index.js";
class ClassRoomController {
    newClassRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                const { _id: classRoomId } = yield Classroom.create(Object.assign(Object.assign({}, body), { typeOfScores: "fibonacci" }));
                return res.status(200).json({ classRoomId });
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(400).json({ error: error.message });
                }
            }
        });
    }
    getClassroom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classroomID = req.headers["x-classroom-id"];
                const classroom = yield Classroom.findById(classroomID);
                return res.status(200).json({ classroom });
            }
            catch (error) {
                if (error instanceof ClassroomNotFound) {
                    return res.status(400).json({ error: "Ups! Parece que esta classroom no existe" });
                }
                if (error instanceof Error) {
                    return res.status(400).json({ error: error.message });
                }
            }
        });
    }
}
class ClassroomNotFound extends Error {
    constructor() {
        super();
    }
}
export const classRoomController = new ClassRoomController();
//# sourceMappingURL=classroom.controller.js.map