import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CreateUserDTO } from "../dtos/auth/register.dto";
import { loginUserDTO } from "../dtos/auth/login.dto";
import { ZodError } from "zod";
import { HttpError } from "../error/http-error";

const userService = new UserService();

export class UserController {

  // REGISTER USER
  async register(req: Request, res: Response) {
    try {
      const data = CreateUserDTO.parse(req.body);
      const user = await userService.createUser(data);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        // <-- use `error.issues` instead of `error.errors`
        return res.status(400).json({ success: false, errors: error.issues });
      }
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }

  // LOGIN USER
  async login(req: Request, res: Response) {
    try {
      const data = loginUserDTO.parse(req.body);
      const result = await userService.loginUser(data);

      res.status(200).json({
        success: true,
        message: "Login successful",
        token: result.token,
        user: result.user,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ success: false, errors: error.issues });
      }
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
  }
}
