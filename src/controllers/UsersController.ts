import {Request, Response} from 'express';
import knex from '../database/connection';
import { staticUrl } from '../config'

class UsersController {

    async create(request: Request, response: Response) {
        let image: string|null = null

        const {
            name,
            email,
            phone,
            password,
            city,
            uf
        }: any = request.body

        if (request.file) {
            image = staticUrl + request.file.filename
        }

        const user: object = {
            image,
            name,
            email,  
            phone,
            password,
            city,
            uf
        }

        // newIds need to be an array of Ids
        const rows: any = await knex('users').insert(user)
        
        if (!rows) {
            return response.status(400).json({ message: `Error creating user!`})
        }
        
        const id: number|undefined = rows[0]
        return response.json({
            id,
            ...user
        })
    }
    
    async index(request: Request, response: Response) {
        const users = await knex('users').select('*').orderBy('name')

        if (users.length===0) {
            return response.status(400).json({ message: 'No users available.'})
        }

        return response.json(users)
    }
    
    async delete(request: Request, response: Response) {
        const { id } = request.params

        const rows = await knex('users').where('id', id).delete() // Return the number of affected rows
            // .returning('id')
    
        if ( rows===0 ) {
            return response.status(400).json({ 
                id,
                message: 'User not found.'
            })
        }

        return response.json({ 
            id,
            rows,
            message: `${rows} row(s) deleted!`
        })
    }

    async update(request: Request, response: Response) {
        interface User {
            image?: string,
            name?: string,
            email?: string,
            phone?: string,
            password?: string,
            city?: string,
            uf?: string
        }
        
        const { id } = request.params

        let image: string|undefined = undefined

        const {
            name,
            email,
            phone,
            password,
            city,
            uf
        }: any = request.body

        if (request.file) {
            image = staticUrl + request.file.filename
        }
        
        let user: User = {} // let user = <User> {}; // let user = {} as User;

        if (image) user.image = image
        if (name) user.name = name
        if (email) user.email = email
        if (phone) user.phone = phone
        if (password) user.password = password
        if (city) user.city = city
        if (uf) user.uf = uf

        const rows = await knex('users')
            .where('id', id)
            .update(user) // Return the number of affected rows

        if ( rows===0 ) {
            return response.status(400).json({ 
                id,
                message: 'User not found.'
            })
        }
        
        return response.json({
            message: `${rows} row(s) updated!`,
            data: user
        })
    }

}
    
export default UsersController;