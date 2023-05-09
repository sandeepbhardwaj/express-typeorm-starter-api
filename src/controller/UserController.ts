import { AppDataSource } from '../data-source';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/User';
import { validate } from 'class-validator';

import asyncHandler = require('express-async-handler');

const userRepository = AppDataSource.getRepository(User);

export class UserController {
  async findAll(request: Request, response: Response, next: NextFunction) {
    const users = await userRepository.find();
    return response.status(200).json(users);
  }

  /**
   * findOne User
   */
  findById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    const id = parseInt(request.params.id);
    const user = await userRepository.findOne({
      where: { id }
    });

    if (!user) {
      response.json({ error: 'unregistered user' });
    }
    response.json(user);
  });

  /**
   * Save User
   */
  save = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
    const { name, email, password, role } = request.body;

    const user = Object.assign(new User(), {
      name,
      email,
      password,
      role
    });

    //Validade if the parameters are ok
    const errors = await validate(user);
    if (errors.length > 0) {
      response.status(400).send(errors);
      return;
    }

    //Hash the password, to securely store on DB
    user.hashPassword();

    response.json(await userRepository.save(user));
  });

  /**
   * Delete user
   */
  async remove(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    let userToRemove = await userRepository.findOneBy({ id });

    if (!userToRemove) {
      return response.status(404).json({ error: 'this user not exist' });
    }

    await userRepository.remove(userToRemove);

    return response.json({ success: 'user has been removed' });
  }
}
