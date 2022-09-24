import ITasksRepository from '@repositories/tasks/ITasksRepository';
import Task from '@models/Task';
import AppError from '@errors/AppError';

export default class GetTaskByIdService {
  constructor(private repository: ITasksRepository) {}

  async execute(taskId: string, userId?: string): Promise<Task> {
    const task = await this.repository.findById(taskId);
    if (userId) {
      if (task.user_id !== userId) {
        throw new AppError('Not allowed to see this task.', 403);
      }
    }
    return task;
  }
}
