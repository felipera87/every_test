import { v4 as uuid } from 'uuid';

import FakeTasksRepository from '@repositories/tasks/FakeTasksRepository';
import AppError from '@errors/AppError';
import DeleteTaskService from './DeleteTaskService';

let fakeTasksRepository: FakeTasksRepository;
let service: DeleteTaskService;

describe('DeleteTaskService', () => {
  beforeEach(() => {
    fakeTasksRepository = new FakeTasksRepository([]);
    service = new DeleteTaskService(fakeTasksRepository);
  });

  it('should be able to delete an existing task regardless of userId.', async () => {
    const userId = uuid();
    const createdTask = await fakeTasksRepository.create(userId, {
      description: 'description1',
      title: 'title1',
    });

    await service.execute(createdTask.id);

    const deletedTask = await fakeTasksRepository.findById(createdTask.id);
    expect(deletedTask).toBe(null);
  });

  it('should be able to delete an existing task with userId.', async () => {
    const userId = uuid();
    const createdTask = await fakeTasksRepository.create(userId, {
      description: 'description2',
      title: 'title2',
    });

    await service.execute(createdTask.id, userId);

    const deletedTask = await fakeTasksRepository.findById(createdTask.id);
    expect(deletedTask).toBe(null);
  });

  it("shouldn't be able to delete an unexisting task.", async () => {
    const taskId = uuid();

    await expect(service.execute(taskId)).rejects.toBeInstanceOf(AppError);
  });

  it("shouldn't be able to delete a task from a different user if userId is informed.", async () => {
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
