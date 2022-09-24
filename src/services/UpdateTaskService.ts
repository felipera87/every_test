import ITaskRepository from '@repositories/tasks/ITasksRepository';
import Task from '@models/Task';
import { IUpdateTaskDTO } from '@repositories/tasks/ITaskDTO';
import AppError from '@errors/AppError';

export default class UpdateTaskService {
  constructor(private repository: ITaskRepository) {}

  async execute(
    taskId: string,
    taskData: IUpdateTaskDTO,
    userId?: string,
  ): Promise<Task> {
    const task = await this.repository.findById(taskId);

    if (!task) {
      throw new AppError('Task not found.');
    }

    if (userId && userId !== task.user_id) {
      throw new AppError('Not allowed to change this task.', 403);
    }

    return this.repository.update(task, taskData);
  }
}
