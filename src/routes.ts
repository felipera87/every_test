import { Router } from 'express';

import { celebrate, Segments, Joi } from 'celebrate';

import { TaskStatus } from '@models/Task';

import TaskController from '@controllers/TasksController';
import SessionsController from '@controllers/SessionsController';
import UsersController from '@controllers/UsersController';

import ensureAuthenticated from './middleware/ensureAuthenticated';

const taskController = new TaskController();
const sessionsController = new SessionsController();
const usersController = new UsersController();

const routes = Router();

routes.post(
  '/user',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      isAdmin: Joi.boolean().default(false),
    },
  }),
  usersController.create,
);

routes.post(
  '/auth',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

routes.use(ensureAuthenticated);

routes.get(
  '/task',
  celebrate({
    [Segments.QUERY]: {
      status: Joi.string().valid(
        TaskStatus.done,
        TaskStatus.inProgress,
        TaskStatus.toDo,
      ),
      archived: Joi.boolean(),
    },
  }),
  taskController.index,
);
routes.get(
  '/task/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid(),
    },
  }),
  taskController.show,
);
routes.post(
  '/task',
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      description: Joi.string().required(),
    },
  }),
  taskController.create,
);
routes.put(
  '/task/:id',
  celebrate({
    [Segments.BODY]: {
      title: Joi.string(),
      description: Joi.string(),
      status: Joi.string().valid(
        TaskStatus.done,
        TaskStatus.inProgress,
        TaskStatus.toDo,
      ),
      archived: Joi.boolean(),
    },
  }),
  taskController.update,
);
routes.delete(
  '/task/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid(),
    },
  }),
  taskController.delete,
);

export default routes;
