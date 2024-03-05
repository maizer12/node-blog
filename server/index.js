import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
import { checkAuth } from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostsController from './controllers/PostController.js';
import multer from 'multer';
import cors from 'cors';

mongoose
  .connect(process.env.MONGO_KEY)
  .then(() => console.log('db is work'))
  .catch((err) => console.log(err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cd) => {
    cd(null, 'uploads');
  },
  filename: (_, file, cd) => {
    cd(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(cors());

app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.json({ message: 'Api is work!' });
});

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/auth/login', UserController.authorization);
app.post('/auth/register', registerValidation, UserController.registration);

app.get('/posts', PostsController.getAll);
app.get('/tags', PostsController.getLastTags);
app.get('/posts/:id', PostsController.getOne);
app.post('/posts', checkAuth, PostsController.createPost);
app.delete('/posts/:id', checkAuth, PostsController.deletePost);
app.patch('/posts/:id', checkAuth, PostsController.updatePost);

app.listen(process.env.PORT, (rej) => {
  if (rej) return console.log(rej);
  console.log('Server started ' + process.env.PORT);
});
