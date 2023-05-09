import { Router } from 'express';
import { UserController } from '../../controller/UserController';
import { validateJwt } from '../../middlewares/AuthValidator';

const router = Router();

const userController = new UserController();

//Get all users
router.get('/', [validateJwt], userController.findAll);
router.get('/:id', [validateJwt], userController.findById);
router.post('/', userController.save);
router.delete('/:id', [validateJwt], userController.remove);

export default router;
