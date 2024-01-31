import { Router } from "express";
import { classRoomController } from "../controllers/classroom.controller.js";
import { body, header } from "express-validator";
import { validateRequest } from "../middlewares/index.js";

export const classroomRouter = Router()

classroomRouter.post("/", [
    body('name').exists().withMessage('Name field is obligatory'),
    validateRequest
], classRoomController.newClassRoom)


classroomRouter.get("/", [
    header('x-classroom-id').exists().withMessage('El id es obligatorio'),
    header('x-classroom-id').isMongoId().withMessage("El id no tiene el formato adecuado"),
    validateRequest
], classRoomController.getClassroom)



