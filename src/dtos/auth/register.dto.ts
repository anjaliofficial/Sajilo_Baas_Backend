import { z } from 'zod';

export const CreateUserDTO = z.object({
    email: z.string().email(),
    password: z.string().min(6,'Password must be at least 6 characters'), 
    confirmPassword: z.string().min(6),
    address: z.string().min(3, 'Address is required'),
    contactNumber: z.string().regex(/^[0-9]{7,15}$/, 'Invalid contact number'),

}).refine((data)=> data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
});