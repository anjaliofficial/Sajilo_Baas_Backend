import { UserRepository } from "../repositories/user.repository";
import { HttpError } from "../error/http-error";
import bcrypt from "bcryptjs";
import { JWT_SECRET } from "../config/index";
import jwt from "jsonwebtoken";
import {CreateUserDTO} from '../dtos/auth/register.dto';
import {loginUserDTO} from '../dtos/auth/login.dto';

const userRepository = new UserRepository();

export class UserService{
    // Register 

    async createUser(data: CreateUserDTO){
        // check email uniquesnes 
        const emailCheck = await userRepository.getUserByEmail(data.email);
        if(emailCheck){
            throw new HttpError('Email already in use', 403);

        }
        // check username 
        const usernameCheck = await userRepository.getUserByUsername(data.username);
        if(usernameCheck){
            throw new HttpError('Username already in use', 403);

        }

        // hash p[assword]
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;

        if(!data.role) data.role = 'user';

        // create User 
        const newUser = await userRepository.createUser({
            email: data.email,
            password: data.password,
            username: data.username,
            address: data.address,
            contactNumber: data.contactNumber,
            role: data.role
        });

        return {
            id: newUser._id,
            email: newUser.email,
            username: newUser.username,
            address: newUser.address,
            contactNumber: newUser.contactNumber,
            role: newUser.role,
        };
    } 


    // Login User 
    async loginUser(data: LoginUserDTO){
        const user = await userRepository.getUserByEmail(data.email);
        if(!user){
            throw new HttpError ('Invalid credentials', 401);

        }
        // Compare password
        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if(!isPasswordValid){
            throw new HttpError('Invalid ccredentials', 401);
        }

        // JWT Payload 
        const payload = {
            id: user._id,
            email: user.email,
            username: user.username,
            address: user.address,
            contactNumber: user.contactNumber,
            role: user.role
        };
        // generate token 
        const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "30d"});
        return {token, user:payload};
    }

}