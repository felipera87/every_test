import { getRepository, Repository } from 'typeorm';
import Task from '@models/Task';
import ITasksRepository from './ITasksRepository';
import {
  ICreateTaskDTO,
  IFindTasksParametersDTO,
  IUpdateTaskDTO,
} from './ITaskDTO';

class TasksRepository implements ITasksRepository {
  private ormRepository: Repository<Task>;

  constructor() {
    this.ormRepository = getRepository(Task);
  }

  async find(findParameters: IFindTasksParametersDTO): Promise<Task[]> {
    const condition: IFindTasksParametersDTO = {};

    const { archived, status, user_id } = findParameters;

    if (archived !== undefined) condition.archived = archived;
    if (status) condition.status = status;
    if (user_id) condition.user_id = user_id;

    return this.ormRepository.find({
      where: condition,
    });
  }

  async findById(taskId: string): Promise<Task> {
    return this.ormRepository.findOne({
      where: { id: taskId },
    });
  }

  async create(userId: string, taskData: ICreateTaskDTO): Promise<Task> {
    const task = this.ormRepository.create({ ...taskData, user_id: userId });

    await this.ormRepository.save(task);

    return task;
  }

  async update(task: Task, taskData: IUpdateTaskDTO): Promise<Task> {
    const updatedTask = Object.assign(task, taskData);

    await this.ormRepository.save(updatedTask);

    return task;
  }

  async delete(taskId: string): Promise<boolean> {
    const deleteResult = await this.ormRepository.delete(taskId);
    if (deleteResult.affected >= 1) {
      return true;
    }
    return false;
  }
}

export default TasksRepository;
