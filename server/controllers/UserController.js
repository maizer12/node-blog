import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

export const registration = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password.toString(), salt);

    const doc = new UserModel({ ...req.body, passwordHash: hash });

    const user = await doc.save();

    const token = jwt.sign({ _id: user._id }, 'secret123', { expiresIn: '30d' });

    const { passwordHash, ...data } = user._doc;

    res.json({
      data,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to register',
    });
  }
};

export const authorization = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });

    if (!user) return res.status(400).json({ message: 'Incorrect email or password!' });

    const isPassword = await bcrypt.compare(req.body.password.toString(), user.passwordHash);

    if (!isPassword) return res.status(400).json({ message: 'Incorrect email or password!' });

    const token = jwt.sign({ _id: user._id }, 'secret123', { expiresIn: '30d' });

    const { passwordHash, ...data } = user._doc;

    res.json({
      data,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Failed to login',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.id);

    if (!user) return res.status(404).json({ message: 'User not found!' });

    const { passwordHash, ...data } = user._doc;

    res.json({ data });
  } catch (err) {
    res.status(403).json({
      message: 'No access',
    });
  }
};