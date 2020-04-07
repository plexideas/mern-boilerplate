import { Router } from 'express';
import UserModel, { User } from '../models/User';
import auth from '../middleware/auth';

const usersRouter = Router();

usersRouter.get('/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

usersRouter.post('/register', (req, res) => {
  const user = new UserModel(req.body);

  user.save((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, userData: doc });
  });
});

usersRouter.post('/login', (req, res) => {
  UserModel.findOne({ email: req.body.email }, (err: Error, user: User) => {
    if (!user) {
      return res.json({
        loginSucces: false,
        err: 'Auth failed, email not found',
      });
    }

    user.comparePassword(req.body.password, (err: Error, isMatch: boolean) => {
      if (!isMatch) {
        return res.json({
          loginSucces: false,
          err: 'Wrong password',
        });
      }
    });

    user.generateToken((err: Error, user: User) => {
      if (err) res.status(400).json({ loginSucces: false, err });
      res.cookie('x_auth', user.token).status(200).json({
        loginSucces: true,
      });
    });
  });
});

usersRouter.get('/logout', auth, (req, res) => {
  UserModel.findOneAndUpdate(
    { _id: req.user._id },
    { token: '', tokenExp: '' },
    (err: Error) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({ success: true });
    },
  );
});

export default usersRouter;
