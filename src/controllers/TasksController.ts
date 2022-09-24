import AppError from '@errors/AppError';
import Task, { TaskStatus } from '@models/Task';
import { IFindTasksParametersDTO } from '@repositories/tasks/ITaskDTO';
import TasksRepository from '@repositories/tasks/TasksRepository';
import CreateTaskService from '@services/CreateTaskService';
import DeleteTaskService from '@services/DeleteTaskService';
import GetTaskByIdService from '@services/GetTaskByIdService';
import GetTasksService from '@services/GetTasksService';
import UpdateTaskService from '@services/UpdateTaskService';
import { Request, Response } from 'express';

export default class TasksController {
  async index(req: Request, res: Response): Promise<Response> {
    const { archived, status } = req.query;

    const { id: userId, isAdmin } = req.user;

    const repository = new TasksRepository();
    const service = new GetTasksService(repository);

    let tasks: Task[];
    const queryPayload: IFindTasksParametersDTO = {
      status: status as TaskStatus,
    };

    if (archived !== undefined) {
      queryPayload.archived = !!archived;
    }

    if (isAdmin) {
      tasks = await service.execute(queryPayload);
    } else {
      queryPayload.user_id = userId;
      tasks = await service.execute(queryPayload);
    }

    return res.json(tasks);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id: taskId } = req.params;

    const { id: userId, isAdmin } = req.user;

    const repository = new TasksRepository();
    const service = new GetTaskByIdService(repository);

    let task: Task;
    if (isAdmin) {
      task = await service.execute(taskId);
    } else {
      task = await service.execute(taskId, userId);
    }

    if (!task) {
      throw new AppError(`Couldn't find task ${taskId}`, 404);
    }

    return res.json(task);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { title, description } = req.body;

    const { id: userId } = req.user;

    const repository = new TasksRepository();
    const service = new CreateTaskService(repository);

    const task = await service.execute(userId, {
      title,
      description,
    });

    return res.json(task);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id: taskId } = req.params;

    const { title, description, status, archived } = req.body;

    const { id: userId, isAdmin } = req.user;

    const repository = new TasksRepository();
    const service = new UpdateTaskService(repository);

    const payload = {
      title,
      description,
      status,
      archived,
    };

    let task: Task;

    if (isAdmin) {
      task = await service.execute(taskId, payload);
    } else {
      task = await service.execute(taskId, payload, userId);
    }

    return res.json(task);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id: taskId } = req.params;

    const { id: userId, isAdmin } = req.user;

    const repository = new TasksRepository();
    const service = new DeleteTaskService(repository);

    if (isAdmin) {
      await service.execute(taskId);
    } else {
      await service.execute(taskId, userId);
    }

    return res.json({});
  }
}
