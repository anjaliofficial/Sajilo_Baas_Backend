import {IUser } from '../models/user.model';
export interface IUserRepository{
    createUser(userData: Partial<IUser>): Promise<IUser >;
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserByUsername(username: string): Promise<IUser | null>;
    getUserById(id: string): Promise<IUser | null>;
    getAllUser(): Promise<IUser[]>;
    updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null>;
    deleteUser(id: string): Promise<boolean>;

}