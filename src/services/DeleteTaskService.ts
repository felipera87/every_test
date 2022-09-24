import ITaskRepository from '@repositories/tasks/ITasksRepository';
import AppError from '@errors/AppError';

export default class DeleteTaskService {
  constructor(private repository: ITaskRepository) {}

  async execute(taskId: string, userId?: string): Promise<void> {
    const task = await this.repository.findById(taskId);

    if (!task) {
      throw new AppError('Task not found.');
    }

    if (userId && userId !== task.user_id) {
      throw new AppError('Not allowed to change this task.', 403);
    }

    const taskDeleted = await this.repository.delete(taskId);
    if (!taskDeleted) {
      throw new AppError(`Could not delete task ${taskId}`);
    }
  }
}
