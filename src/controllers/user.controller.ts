import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CreateUserDTO } from "../dtos/auth/register.dto"; 
// adjust path if needed
import { ZodError } from "zod";
import { loginUserDTO } from "../dtos/auth/login.dto"; 

const userService = new UserService();

export class UserController {

  // REGISTER USER
  async register(req: Request, res: Response) {
    try {
      // Validate input
      const data = CreateUserDTO.parse(req.body);

      // Call service to create user
      const user = await userService.createUser(data);

      res.status(201).json({
        message: "User registered successfully",
        user,
      });

    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error });
      }
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  }

  // LOGIN USER
  async login(req: Request, res: Response) {
    try {
      // Validate input
      const data = loginUserDTO.parse(req.body);

      // Call service to login
      const result = await userService.loginUser(data);

      res.status(200).json({
        message: "Login successful",
        token: result.token,
        user: result.user,
      });

    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ errors: error });
      }
      res.status(error.statusCode || 400).json({ message: error.message });
    }
  }
}
