import express from "express";
import {
  register,
  login,
  logout,
  generate2FA,
  validate2FA,
  login2FA,
} from "../controllers/authController.js";
import { ensureAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/login/2fa", login2FA);

router.get("/2fa/generate", ensureAuthenticated, generate2FA);

router.post("/2fa/validate", ensureAuthenticated, validate2FA);

router.get("/logout", ensureAuthenticated, logout);

export default router;
