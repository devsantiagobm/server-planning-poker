import { validationResult } from "express-validator";
export function validateRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array()[0].msg;
        return res.status(400).json({ error });
    }
    next();
}
//# sourceMappingURL=validateRequest.middleware.js.map