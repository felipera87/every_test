import Task, { TaskStatus } from '@models/Task';
import { v4 as uuid } from 'uuid';
import {
  IFindTasksParametersDTO,
  ICreateTaskDTO,
  IUpdateTaskDTO,
} from './ITaskDTO';
import ITasksRepository from './ITasksRepository';

class FakeTasksRepository implements ITasksRepository {
  constructor(private tasks: Task[]) {}

  async find(findParameters: IFindTasksParametersDTO): Promise<Task[]> {
    let result: Task[] = [...this.tasks];
    const { archived, status, user_id } = findParameters;
    if (archived !== undefined) {
      result = result.filter(task => task.archived === archived);
    }

    if (status) {
      result = result.filter(task => task.status === status);
    }

    if (user_id) {
      result = result.filter(task => task.user_id === user_id);
    }

    return result;
  }

  async findById(taskId: string): Promise<Task> {
    const findTask = this.tasks.filter(task => task.id === taskId);
    if (findTask.length > 0) {
      return findTask[0];
    }
    return null;
  }

  async create(userId: string, taskData: ICreateTaskDTO): Promise<Task> {
    const { description, title } = taskData;
    const newTask: Task = {
      archived: false,
      description,
      title,
      user_id: userId,
      id: uuid(),
      created_at: new Date(),
      updated_at: new Date(),
      status: TaskStatus.toDo,
      user: null,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  async update(task: Task, taskData: IUpdateTaskDTO): Promise<Task> {
    const { description, title, archived, status } = taskData;
    const newTask: IUpdateTaskDTO = {
      archived,
      description,
      title,
      status,
    };

    const taskIndex = this.tasks.findIndex(findTask => findTask.id === task.id);
    this.tasks[taskIndex] = Object.assign(task, newTask);
    return this.tasks[taskIndex];
  }

  async delete(taskId: string): Promise<boolean> {
    const taskIndex = this.tasks.findIndex(findTask => findTask.id === taskId);
    if (taskIndex >= 0) {
      this.tasks.splice(taskIndex, 1);
      return true;
    }
    return false;
  }
}

export default FakeTasksRepository;
