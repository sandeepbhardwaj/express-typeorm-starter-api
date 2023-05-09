import { Router } from 'express';
import AuthController from '../../controller/AuthController';
import { validateJwt } from '../../middlewares/AuthValidator';

const authController = new AuthController();

const router = Router();
// Login route
router.post('/login', authController.login);

// Change my password
router.post('/change-password', [validateJwt], authController.changePassword);

export default router;
