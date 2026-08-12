import { Router, Request, Response } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const authController = new AuthController();

router.post("/register", (req: Request, res: Response) =>
  authController.register(req, res)
);

router.post("/login", (req: Request, res: Response) =>
  authController.login(req, res)
);

router.get("/me", authenticate, (req: Request, res: Response) =>
  authController.getProfile(req, res)
);

export default router;