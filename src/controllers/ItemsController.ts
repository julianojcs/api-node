import {Request, Response} from 'express';
import knex from '../database/connection';

import { staticUrl } from '../config';

class ItemsController {

  async index(request: Request, response: Response) {
    const items = await knex('items').select('*')
    const serializedItems = items.map((item: any) => {
        return {
            id: item.id,
            title: item.title,
            image_url: staticUrl + item.image
        }
    })
    return response.json(serializedItems)
  }

}

export default ItemsController;
