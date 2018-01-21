import express from 'express';
import { apiUsers, apiUsersProtected } from './users';
import { isAuthenticated, initAuth } from '../business/auth';
import { apiPosts, apiPostsProtected } from './posts';

const api = express();
const hpp = require('hpp');
const helmet = require('helmet');

initAuth();
api.use(express.json({ limit: '1mb' }));
api.use(hpp());
api.use(helmet());

const apiRoutes = express.Router();
apiRoutes
  .use('/users', apiUsers)
  .use('/posts', apiPosts)
  // api bellow this middelware require Authorization
  .use(isAuthenticated)
  .use('/users', apiUsersProtected)
  .use('/posts', apiPostsProtected)
  .use((err, req, res, next) => {
    res.status(403).send({
      success: false,
      message: `${err.name} : ${err.message}`,
    });
    next();
  });

api.use('/api/v1', apiRoutes);
export default api;
