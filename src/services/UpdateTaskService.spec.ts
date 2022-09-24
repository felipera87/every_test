import { v4 as uuid } from 'uuid';

import FakeTasksRepository from '@repositories/tasks/FakeTasksRepository';
import AppError from '@errors/AppError';
import { TaskStatus } from '@models/Task';
import UpdateTaskService from './UpdateTaskService';

let fakeTasksRepository: FakeTasksRepository;
let service: UpdateTaskService;

describe('UpdateTaskService', () => {
  beforeEach(() => {
    fakeTasksRepository = new FakeTasksRepository([]);
    service = new UpdateTaskService(fakeTasksRepository);
  });

  it('should be able to update an existing task regardless of userId.', async () => {
    const userId = uuid();
    const createdTask = await fakeTasksRepository.create(userId, {
      description: 'description1',
      title: 'title1',
    });

    await service.execute(createdTask.id, {
      title: 'title2',
      description: 'description2',
      archived: true,
      status: TaskStatus.inProgress,
    });

    const updatedTask = await fakeTasksRepository.findById(createdTask.id);
    expect(updatedTask).toBeDefined();
    expect(updatedTask.title).toBe('title2');
    expect(updatedTask.description).toBe('description2');
    expect(updatedTask.archived).toBe(true);
    expect(updatedTask.status).toBe(TaskStatus.inProgress);
  });

  it('should be able to update an existing task with userId.', async () => {
    const userId = uuid();
    const createdTask = await fakeTasksRepository.create(userId, {
      description: 'description1',
      title: 'title1',
    });

    await service.execute(
      createdTask.id,
      {
        title: 'title2',
        description: 'description2',
        archived: true,
        status: TaskStatus.inProgress,
      },
      userId,
    );

    const updatedTask = await fakeTasksRepository.findById(createdTask.id);
    expect(updatedTask).toBeDefined();
    expect(updatedTask.title).toBe('title2');
    expect(updatedTask.description).toBe('description2');
    expect(updatedTask.archived).toBe(true);
    expect(updatedTask.status).toBe(TaskStatus.inProgress);
  });

  it("shouldn't be able to update an unexisting task.", async () => {
    const taskId = uuid();

    const userId = uuid();
    await fakeTasksRepository.create(userId, {
      description: 'description1',
      title: 'title1',
    });

    expect(
      service.execute(taskId, {
        title: 'title2',
        description: 'description2',
        archived: true,
        status: TaskStatus.inProgress,
      }),
    ).rejects.toBeInstanceOf(AppError);
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
      service.execute(
        created1Task.id,
        {
          title: 'title2',
          description: 'description2',
          archived: true,
          status: TaskStatus.inProgress,
        },
        user2Id,
      ),
    ).rejects.toBeInstanceOf(AppError);
  });
});
