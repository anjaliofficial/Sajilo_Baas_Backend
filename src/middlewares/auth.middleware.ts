import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../error/http-error";
import { JWT_SECRET } from "../config";
import { UserRepository } from "../repositories/user.repository";
import { IUser } from "../models/user.model";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: IUser; // attached user object
    }
  }
}

const userRepository = new UserRepository();

/**
 * General authorized middleware
 * Validates JWT and attaches user to req.user
 */
export const authorizedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError("Unauthorized: token malformed", 401);
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    if (!token) throw new HttpError("Unauthorized: No token provided", 401);

    const decoded = jwt.verify(token, JWT_SECRET) as Record<string, any>;
    if (!decoded || !decoded.id) {
      throw new HttpError("Unauthorized: Invalid token", 401);
    }

    const user = await userRepository.getUserById(decoded.id);
    if (!user) throw new HttpError("Unauthorized: User not found", 401);

    req.user = user; // attach user to request
    return next();
  } catch (error: any) {
    return res.status(error.statusCode ?? 401).json({
      success: false,
      message: error.message || "Unauthorized",
    });
  }
};

/**
 * Role-based access middleware
 * Pass allowed roles as array ["admin","host"]
 */
export const roleMiddleware =
  (allowedRoles: Array<"admin" | "user" | "host">) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new HttpError("Forbidden: No user info", 403);
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new HttpError("Forbidden: Insufficient permissions", 403);
      }

      return next();
    } catch (error: any) {
      return res.status(error.statusCode ?? 403).json({
        success: false,
        message: error.message || "Forbidden",
      });
    }
  };
