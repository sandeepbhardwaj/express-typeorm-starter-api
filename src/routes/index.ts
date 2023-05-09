import { Router, Request, Response } from 'express';
import user from './apis/user';
import auth from './apis/auth';

const routes = Router();

routes.use('/users', user);
routes.use('/auth', auth);

export default routes;
