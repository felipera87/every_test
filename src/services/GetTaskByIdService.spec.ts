import { v4 as uuid } from 'uuid';

import FakeTasksRepository from '@repositories/tasks/FakeTasksRepository';
import AppError from '@errors/AppError';
import GetTaskByIdService from './GetTaskByIdService';

let fakeTasksRepository: FakeTasksRepository;
let service: GetTaskByIdService;

describe('GetTaskByIdService', () => {
  beforeEach(() => {
    fakeTasksRepository = new FakeTasksRepository([]);
    service = new GetTaskByIdService(fakeTasksRepository);
  });

  it('should be able to get a existing task regardless of userId.', async () => {
    const userId = uuid();
    const createdTask = await fakeTasksRepository.create(userId, {
      description: 'description',
      title: 'title',
    });

    const task = await service.execute(createdTask.id);

    expect(task).toBeDefined();
    expect(task.id).toBe(createdTask.id);
  });

  it('should be able to get a existing task with userId.', async () => {
    const userId = uuid();
    const createdTask = await fakeTasksRepository.create(userId, {
      description: 'description',
      title: 'title',
    });

    const task = await service.execute(createdTask.id, userId);

    expect(task).toBeDefined();
    expect(task.id).toBe(createdTask.id);
  });

  it("shouldn't be able to get a task from a different user if userId is informed.", async () => {
    const user1Id = uuid();
    const user2Id = uuid();
    const created1Task = await fakeTasksRepository.create(user1Id, {
      description: 'description1',
      title: 'title1',
    });
    await fakeTasksRepository.create(user2Id, {
      description: 'description2',
      title: 'title2',
    });

    await expect(
      service.execute(created1Task.id, user2Id),
    ).rejects.toBeInstanceOf(AppError);
  });
});
