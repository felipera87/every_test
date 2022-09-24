import { TaskStatus } from '@models/Task';

export interface ICreateTaskDTO {
  title: string;
  description: string;
}

export interface IUpdateTaskDTO {
  title: string;
  description: string;
  status: TaskStatus;
  archived: boolean;
}

export interface IFindTasksParametersDTO {
  archived?: boolean;
  status?: TaskStatus;
  user_id?: string;
}
