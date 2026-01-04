import { UserRepository } from "../repositories/user.repository"; 
import { HttpError } from "../error/http-error";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { CreateUserDTOType } from "../dtos/auth/register.dto";
import { loginUserDTO } from "../dtos/auth/login.dto";
const userRepository = new UserRepository();

export class UserService {

  // REGISTER USER
  async createUser(data: CreateUserDTOType) {
    // Check email uniqueness
    const emailCheck = await userRepository.getUserByEmail(data.email);
    if (emailCheck) throw new HttpError("Email already in use", 403);

    // Check username uniqueness
    const usernameCheck = await userRepository.getUserByUsername(data.username);
    if (usernameCheck) throw new HttpError("Username already in use", 403);

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Default role
    const role = data.role || "user";

    // Create user
    const newUser = await userRepository.createUser({
      email: data.email,
      password: hashedPassword,
      username: data.username,
      address: data.address,
      contactNumber: data.contactNumber,
      role,
    });

    // Return user data without password
    return {
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      address: newUser.address,
      contactNumber: newUser.contactNumber,
      role: newUser.role,
    };
  }

  // LOGIN USER
  async loginUser(data: loginUserDTO) {
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) throw new HttpError("Invalid credentials", 401);

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw new HttpError("Invalid credentials", 401);

    // JWT Payload
    const payload = {
      id: user._id,
      email: user.email,
      username: user.username,
      address: user.address,
      contactNumber: user.contactNumber,
      role: user.role,
    };

    // Generate JWT token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

    return { token, user: payload };
  }
}
