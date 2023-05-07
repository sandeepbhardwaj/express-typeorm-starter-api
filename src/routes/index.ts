import { Router, Request, Response } from 'express';
import user from './apis/user';

const routes = Router();

routes.use('/users', user);

export default routes;
