import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ApplicationConfig as config } from '../config/config';

export const validateJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  let token: string;
  const authHeader = String(req.headers['authorization'] || '');
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7, authHeader.length);
    //const payload = jwtDecode(token) as JwtPayload;
  }

  //const token = <string>req.headers['auth'];
  let jwtPayload;

  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, config.server.token.secret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send('Invalid or expired token');
    return;
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { userId, username } = jwtPayload;
  const newToken = jwt.sign({ userId, username }, config.server.token.secret, {
    expiresIn: '1h'
  });

  res.setHeader('token', newToken);

  //Call the next middleware or controller
  next();
};
