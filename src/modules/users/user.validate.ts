import { z } from 'zod';

export const createUserSchema = z.object({
    email: 
        z.string()
        .email('Invalid email address'),
    password: 
        z.string()
        .min(8, 'Password must be at least 8 characters long')
        .max(25, 'Password must be at most 25 characters long')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    name: 
        z.string()
        .min(3, 'Name must be at least 3 characters long')
        .max(25, 'Name must be at most 25 characters long'),
});