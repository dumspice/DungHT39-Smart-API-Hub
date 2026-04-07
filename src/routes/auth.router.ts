import { Router } from "express";
import { login, register } from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { loginSchema, registerSchema } from "../schema/auth.schema";

const router = Router();

router.post("/login", validateRequest(loginSchema), login);
router.post("/register", validateRequest(registerSchema), register);

export default router;
