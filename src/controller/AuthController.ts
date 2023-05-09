import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { validate } from 'class-validator';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { ApplicationConfig as config } from '../config/config';

const userRepository = AppDataSource.getRepository(User);

export default class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    // Check if username and password are set
    if (!(email && password)) {
      console.error('Empty name or password!');
      return res.status(400).send({
        error: 'Empty name or password'
      });
    }

    // Get user from database
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      console.error('Cant find user from DB!');
      return res.status(401).send({
        error: 'Cant find user from DB'
      });
    }

    // Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      console.error('Cannot match encrypted password!');
      return res.status(401).send({
        error: 'Cannot match encrypted password'
      });
    }

    // Sing JWT, valid for 1 hour
    const token = jwt.sign({ userId: user.id, username: user.name }, config.server.token.secret, {
      expiresIn: '1h'
    });

    // Send the jwt in the response
    res.send(token);
  }

  async changePassword(req: Request, res: Response) {
    // Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    // Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    // Get user from the database
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    // Check if old password matches
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();
      return;
    }

    // Validate the model (Password length)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    // Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  }
}
