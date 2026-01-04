import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authorizedMiddleware, roleMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const userController = new UserController();

// Public routes
router.post("/register", userController.register.bind(userController));
router.post("/login", userController.login.bind(userController));

// router.get("/profile", authorizedMiddleware, (req, res) => {
//   res.json({ message: "User profile info", user: req.user });
// });

// Admin-only route
router.get("/admin", authorizedMiddleware, roleMiddleware(["admin"]), (req, res) => {
  res.json({ message: "Admin dashboard", user: req.user });
});

// Admin + Host route
router.get("/host-area", authorizedMiddleware, roleMiddleware(["admin", "host"]), (req, res) => {
  res.json({ message: "Host area", user: req.user });
});

export default router;
