import { v4 as uuid } from 'uuid';

import FakeTasksRepository from '@repositories/tasks/FakeTasksRepository';
import { TaskStatus } from '@models/Task';
import CreateTaskService from './CreateTaskService';

let fakeTasksRepository: FakeTasksRepository;
let service: CreateTaskService;

describe('CreateTaskService', () => {
  beforeEach(() => {
    fakeTasksRepository = new FakeTasksRepository([]);
    service = new CreateTaskService(fakeTasksRepository);
  });

  it('should be able to create a task.', async () => {
    const userId = uuid();

    const task = await service.execute(userId, {
      description: 'description',
      title: 'title',
    });

    expect(task).toBeDefined();
    expect(task.id).toBeDefined();
    expect(task.user_id).toBe(userId);
    expect(task.archived).toBe(false);
    expect(task.status).toBe(TaskStatus.toDo);
    expect(task.created_at).toBeDefined();
    expect(task.updated_at).toBeDefined();
  });
});
