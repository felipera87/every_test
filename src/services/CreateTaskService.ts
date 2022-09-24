import ITaskRepository from '@repositories/tasks/ITasksRepository';
import Task from '@models/Task';
import { ICreateTaskDTO } from '@repositories/tasks/ITaskDTO';

export default class CreateTaskService {
  constructor(private repository: ITaskRepository) {}

  async execute(userId: string, taskData: ICreateTaskDTO): Promise<Task> {
    return this.repository.create(userId, taskData);
  }
}
