import {Request, Response} from 'express';
import knex from '../database/connection';
import { staticUrl } from '../config'

class LocationsController {

    async index(request: Request, response: Response) {
        interface Location {
            city?: string,
            uf?: string,
            items?: string|Array<number>|Array<string>
        }

        const { city, uf, items }: Location = request.query

        let params: Location = {}
        if (city) params.city = city
        if (uf) params.uf = uf

        const parsedItems: Number[] = String(items).split(',').map(item => Number(item.trim()))

        const locations = await knex('locations')
            .leftJoin('location_items', 'locations.id', '=', 'location_items.location_id')
            .where(params)
            .where(function() {
                if (items){    
                    this.whereIn('location_items.item_id', parsedItems)
                }
            })
            .distinct()
            .debug(true)
            .select('locations.*')
    
        for (let i:number=0; i<locations.length; i++){
            const itemsDB = await knex('items')
                .join('location_items', {'items.id': 'location_items.item_id'})
                .where({'location_items.location_id': locations[i].id})
                .select('items.*')
                .then((items) => { 
                    return items.map((item: any) => {
                        return {
                            id: item.id,
                            title: item.title,
                            image_url: staticUrl + item.image
                        }
                    })
                })
            locations[i] = {
                ...locations[i],
                items: itemsDB
            }
        }
        
        console.log( locations )
        return response.json(locations)
    }

    // show
    async find(request: Request, response: Response) {
        const { id } = request.params

        // const location = await knex('locations').where('id', id).first()
        const location = await knex('locations').where('id', id).first().timeout(10000)

        if (!location) {
            return response.status(400).json({ message: `Item ${id} not found!`})
        }

        // const items = await knex('items')
        //     .join('location_items', 'items.id', '=', 'location_items.item_id'})
        //     .where('location_items.location_id', id)
        //     .select('items.title')

        const items = await knex('items')
            .join('location_items', {'items.id': 'location_items.item_id'})
            .where({'location_items.location_id': id})
            .select('items.*')
            .timeout(10000)
            .then((items) => { 
                console.log(items)
                return items.map((item: any) => {
                    return {
                        id: item.id,
                        title: item.title,
                        image_url: staticUrl + item.image
                    }
                })
            })
            

        return response.json({
            ...location,
            items
        })
    }

    async create(request: Request, response: Response) {
        let serializedItems
        
        let image: string|null = null
        if (request.file) {
            image = staticUrl + request.file.filename
        }

        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        }: any = request.body

        if ( typeof(items)!=='undefined' ) {
            // If items is array, return items, else if items is String, return serialized items
            if ( Array.isArray(items)) {
                serializedItems = items 
            } else {
                serializedItems = items.split(',').map((item: string) => Number(item.trim()))
            }
        }
        const location: object = {
            image,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }

        const transaction = await knex.transaction();
        // newIds need to be an array of Ids
        const newIds: Array<number> = await transaction('locations').insert(location)
        const location_id: number = newIds[0]

        if (serializedItems?.length) { // Same as: if(items && items.length) {
            let itemNotFound: number|undefined = undefined

            const itemsBd = await transaction('items').select('id')

            const itemsIdBd: Array<number> = itemsBd.map(item => {
                return item.id
            })
            
            serializedItems.forEach((item: number) => {
                if(!itemsIdBd.includes(item)) {
                    itemNotFound = item
                }
            })
            
            if (itemNotFound) {
                transaction.rollback()
                return response.status(400).json({ message: `Item ${itemNotFound} not found!`})
            }

            const locationItems = serializedItems.map((item_id: number) => {
            // const locationItems = items.map(async (item_id: number) => {
                // const selectedItem = await transaction('items').where('id', item_id).first()
                // if (!selectedItem) {
                //     return response.status(400).json({ message: `Item ${item_id} not itemNotFound!`})
                // }

                return {
                    item_id,
                    location_id
                }
            })

            await transaction('location_items').insert(locationItems)
        }

        await transaction.commit();

        return response.json({
            id: location_id,
            ...location
        })
    }
    
    async updateImage(request: Request, response: Response) {
        const { id } = request.params
        let image: string|null = null
        let fileExtension: string|null = null
        let list = ['png', 'gif', 'jpg', 'jpeg']

        if (request.file) {
            image = staticUrl + request.file.filename
            fileExtension = request.file.mimetype.split('/')[1]
        } else {
            return response.status(400).json({ message: `Location ${id} not found!`})
        }

        if (list.indexOf(fileExtension) < 0) {
            return response.status(400).json({ message: `File extension "${fileExtension}" not allowed`})
        }
        
        const location: any = await knex('locations').where('id', id).first().select('id').timeout(10000)
    
        if (!location) {
            return response.status(400).json({ message: `Location ${id} not found!`})
        }
    
        const locationUpdated = { image }
    
        await knex('locations').update(locationUpdated).where('id', id)
    
        return response.json(locationUpdated.image)
    }
}

export default LocationsController;