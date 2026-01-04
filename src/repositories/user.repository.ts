import { UserModel, IUser } from "../models/user.model";
import bcrypt from "bcrypt";

export interface IUserRepository{
    createUser(userData: Partial<IUser>): Promise<IUser >;
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserByUsername(username: string): Promise<IUser | null>;
    getUserById(id: string): Promise<IUser | null>;
    getAllUsers(): Promise<IUser[]>;
    updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
    deleteUser(id: string): Promise<boolean>;

};

export class UserRepository implements IUserRepository {
  getAllUser(): Promise<IUser[]> {
      throw new Error("Method not implemented.");
  }
  // Create user (hash password before saving)
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const user = new UserModel(userData);
    return await user.save();
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  // Get user by username
  async getUserByUsername(username: string): Promise<IUser | null> {
    return await UserModel.findOne({ username });
  }

  // Get user by ID
  async getUserById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }

  // Get all users
  async getAllUsers(): Promise<IUser[]> {
    return await UserModel.find();
  }

  // Update user
  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  // Delete user
  async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }
}
