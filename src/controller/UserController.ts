import { AppDataSource } from '../data-source';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/User';

const userRepository = AppDataSource.getRepository(User);

export class UserController {
    async all(request: Request, response: Response, next: NextFunction) {
        const users = await userRepository.find();
        return response.status(200).json(users);
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);
        const user = await userRepository.findOne({
            where: { id }
        });

        if (!user) {
            return response.json({ error: 'unregistered user' });
        }
        return response.json(user);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { firstName, lastName, age } = request.body;

        const user = Object.assign(new User(), {
            firstName,
            lastName,
            age
        });

        return response.json(await userRepository.save(user));
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id);

        let userToRemove = await userRepository.findOneBy({ id });

        if (!userToRemove) {
            return response.json({ error: 'this user not exist' });
        }

        await userRepository.remove(userToRemove);

        return response.json({ success: 'user has been removed' });
    }
}
