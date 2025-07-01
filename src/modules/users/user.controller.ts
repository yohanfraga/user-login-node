import { Request, Response, RequestHandler } from 'express';
import { createUser, findUserByEmail, findUserById } from './user.service';
import { CreateUserInput, PublicUser } from './user.types';
import { getNotifications } from '../../utils/notification/notification.handler';
import { interpolateError } from '../../utils/error/errors.interpolation';
import { NotFoundError } from '../../utils/error/errors';

export const registerUserHandler: RequestHandler<unknown, unknown, CreateUserInput> = async (req, res) => {
    const user = await createUser(req.body);
    
    if (user) {
        res.status(201).json(user);
    }
}; 

export const findUserByEmailHandler: RequestHandler<{ email: string }, unknown, PublicUser> = async (req, res) => {
    const user = await findUserByEmail(req.params.email);
    
    if (user) {
        res.status(200).json(user);
    }
};

export const findUserByIdHandler: RequestHandler<{ id: string }, unknown, PublicUser> = async (req, res) => {
    const user = await findUserById(req.params.id);
    
    if (user) {
        res.status(200).json(user);
    }
};