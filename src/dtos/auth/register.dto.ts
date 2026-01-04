import { z } from "zod";

// Register DTO
export const CreateUserDTO = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  address: z.string().min(3, "Address is required"),
  contactNumber: z
    .string()
    .regex(/^[0-9]{7,15}$/, "Invalid contact number"),
  role: z.enum(["user", "admin", "host"]).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type CreateUserDTOType = z.infer<typeof CreateUserDTO>;