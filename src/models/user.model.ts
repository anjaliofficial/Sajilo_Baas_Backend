import { Schema, model} from 'mongoose';
import { required } from 'zod/mini';
import { tr } from 'zod/v4/locales';

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['admin', 'user', 'host'],
            default: 'user',

        },

    },
    {timestamps: true}
);