import UserModel, { User } from '../models/User';
import { Request, Response } from 'express';

export default (req: Request, res: Response, next: Function): void => {
  const token = req.cookies.x_auth;
  UserModel.findByToken(token, (err: Error, user: User) => {
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true,
      });

    req.token = token;
    req.user = user;
  });

  next();
};
