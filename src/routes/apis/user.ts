import { Router } from 'express';
import { UserController } from '../../controller/UserController';

const router = Router();

const userController = new UserController();

//Get all users
router.get('/', userController.all);
router.get('/:id', userController.one);
router.post('/', userController.save);
router.delete('/:id', userController.remove);

export default router;
