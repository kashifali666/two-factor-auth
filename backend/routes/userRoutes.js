import express from "express";
import { getCurrentUser } from "../controllers/userController.js";
import {
  authorize,
  ensureAuthenticated,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/users/current", ensureAuthenticated, getCurrentUser);

router.get("/admin", ensureAuthenticated, authorize(["admin"]), (req, res) => {
  return res
    .status(200)
    .json({ message: "Only admins can access this route!" });
});

router.get(
  "/moderator",
  ensureAuthenticated,
  authorize(["admin", "moderator"]),
  (req, res) => {
    return res
      .status(200)
      .json({ message: "Only admins and moderators can access this route!" });
  }
);

export default router;
