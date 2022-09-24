import ITaskRepository from '@repositories/tasks/ITasksRepository';
import Task from '@models/Task';
import { IFindTasksParametersDTO } from '@repositories/tasks/ITaskDTO';

export default class GetTasksService {
  constructor(private repository: ITaskRepository) {}

  async execute(findParameters: IFindTasksParametersDTO): Promise<Task[]> {
    const tasks = await this.repository.find(findParameters);

    return tasks;
  }
}
