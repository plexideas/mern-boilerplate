import { Schema, Document, model, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment';

interface UserSchema extends Document {
  name: string;
  lastname?: string;
  email: string;
  password: string;
  role: number;
  token?: string;
  tokenExp?: number;
  image: string;
}

export interface User extends UserSchema {
  comparePassword(pass: string, cb: CallableFunction): void;
  generateToken(cb: CallableFunction): void;
}

interface UserWithStatic extends Model<User> {
  findByToken(token: string, cb: CallableFunction): void;
}

const saltRounds = 10;
const userSchema: Schema = new Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
  image: {
    type: String,
  },
});

userSchema.pre<UserSchema>('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (
  plainPassword: string,
  cb: CallableFunction,
): CallableFunction | void {
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    err ? cb(err) : cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb: CallableFunction): void {
  const token = jwt.sign(this._id.toHexString(), 'secret');
  const oneHour = moment().add(1, 'hour').valueOf();

  this.tokenExp = oneHour;
  this.token = token;

  this.save((err: Error, user: User) => {
    err ? cb(err) : cb(null, user);
  });
};

userSchema.statics.findByToken = function (
  token: string,
  cb: CallableFunction,
): void {
  jwt.verify(token, 'secret', (err, decode) => {
    this.findOne({ _id: decode, token: token }, (err: Error, user: User) => {
      err ? cb(err) : cb(null, user);
    });
  });
};

const UserModel = model<User, UserWithStatic>('User', userSchema);

export default UserModel;
