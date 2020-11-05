import {Request, Response} from 'express';
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import knex from '../database/connection';
import { jwt } from '../config';

class SessionController {

    async create(request: Request, response: Response) {
        const { email, password } = request.body
        const user = await knex('users').where('email', email).first()

        if (!user) {
            return response.status(400).json({ message: 'Credentials not found.'})
        }

        const comparePassword = await compare(password, user.password)

        if (!comparePassword) {
            return response.status(400).json({ message: 'Invalid credentials.'})
        }

        const token = sign(
            {
                name: user.name,
                email: user.email
            }, 
            jwt.JWT_KEY, 
            {
                subject: String(user.id),
                expiresIn: jwt.EXPIRES_IN
            }
        )

        return response.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            token
        })
    }
}

export default SessionController;