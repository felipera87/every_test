import Task from '@models/Task';
import {
  ICreateTaskDTO,
  IFindTasksParametersDTO,
  IUpdateTaskDTO,
} from './ITaskDTO';

export default interface ITasksRepository {
  find(findParameters: IFindTasksParametersDTO): Promise<Task[]>;
  findById(taskId: string): Promise<Task | null>;
  create(userId: string, taskData: ICreateTaskDTO): Promise<Task>;
  update(task: Task, taskData: IUpdateTaskDTO): Promise<Task>;
  delete(taskId: string): Promise<boolean>;
}
