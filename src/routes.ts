import express from 'express';
import {celebrate, Joi} from 'celebrate';
import multer from 'multer';
import multerConfig from './config/multer';
import { 
    locationsReqRules as locRules, 
    usersReqRules as usrRules, 
    usersUpdateReqRules as usrUpRules,
    joiOpts } from './config/celebrate';
import isAuthenticated from '../src/middlewares/isAuthenticated'
import LocationsController from './controllers/LocationsController';
import ItemsController from './controllers/ItemsController';
import UsersController from './controllers/UsersController';
import SessionsController from './controllers/SessionsController';

const routes = express.Router();
const upload = multer(multerConfig);

const itemsController = new ItemsController();
const locationsController = new LocationsController();
const usersController = new UsersController();
const sessionsController = new SessionsController();

routes.get('/items', itemsController.index);

routes.get('/locations/:id', isAuthenticated, locationsController.show);
routes.get('/locations', isAuthenticated, locationsController.index);
routes.post('/locations', upload.single('image'), celebrate(locRules, joiOpts), locationsController.create);
routes.put('/locations', isAuthenticated, upload.single('image'), locationsController.updateImage);

routes.get('/users', isAuthenticated, celebrate(usrRules, joiOpts), usersController.index);
routes.post('/users', isAuthenticated, celebrate(usrRules, joiOpts), usersController.create);
routes.delete('/users/:id', isAuthenticated, usersController.delete);
routes.patch('/users/:id', isAuthenticated, celebrate(usrUpRules, joiOpts), usersController.update);

routes.post('/sessions', celebrate(usrRules, joiOpts), sessionsController.create);

export default routes;
