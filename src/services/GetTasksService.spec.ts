import { v4 as uuid } from 'uuid';

import FakeTasksRepository from '@repositories/tasks/FakeTasksRepository';
import Task, { TaskStatus } from '@models/Task';
import GetTasksService from './GetTasksService';

let fakeTasksRepository: FakeTasksRepository;
let service: GetTasksService;
const userId: string = uuid();
const fakeTasks: Task[] = [
  {
    description: 'description1',
    title: 'title1',
    archived: false,
    id: uuid(),
    created_at: new Date(),
    updated_at: new Date(),
    status: TaskStatus.toDo,
    user_id: userId,
    user: null,
  },
  {
    description: 'description2',
    title: 'title2',
    archived: false,
    id: uuid(),
    created_at: new Date(),
    updated_at: new Date(),
    status: TaskStatus.inProgress,
    user_id: userId,
    user: null,
  },
  {
    description: 'description3',
    title: 'title3',
    archived: false,
    id: uuid(),
    created_at: new Date(),
    updated_at: new Date(),
    status: TaskStatus.done,
    user_id: userId,
    user: null,
  },
  {
    description: 'description4',
    title: 'title4',
    archived: true,
    id: uuid(),
    created_at: new Date(),
    updated_at: new Date(),
    status: TaskStatus.done,
    user_id: userId,
    user: null,
  },
  {
    description: 'description5',
    title: 'title5',
    archived: false,
    id: uuid(),
    created_at: new Date(),
    updated_at: new Date(),
    status: TaskStatus.toDo,
    user_id: uuid(),
    user: null,
  },
];

describe('GetTasksService', () => {
  beforeEach(() => {
    fakeTasksRepository = new FakeTasksRepository(fakeTasks);
    service = new GetTasksService(fakeTasksRepository);
  });

  it('should be able to get a all tasks if userId is not informed.', async () => {
    const tasks = await service.execute({});

    expect(tasks).toBeDefined();
    expect(tasks).toHaveLength(fakeTasks.length);
  });

  it('should be able to get only user tasks if userId is informed.', async () => {
    const tasks = await service.execute({ user_id: userId });

    expect(tasks).toBeDefined();
    expect(tasks).toHaveLength(4);
  });

  it.each([TaskStatus.done, TaskStatus.inProgress, TaskStatus.toDo])(
    'should be able to filter tasks by status: %s',
    async status => {
      const tasks = await service.execute({ user_id: userId, status });

      expect(tasks).toBeDefined();
      if (status === TaskStatus.done) {
        expect(tasks).toHaveLength(2);
      } else {
        expect(tasks).toHaveLength(1);
      }
    },
  );

  it.each([true, false])(
    'should be able to filter tasks by archived: %s',
    async archived => {
      const tasks = await service.execute({ user_id: userId, archived });

      expect(tasks).toBeDefined();
      if (archived) {
        expect(tasks).toHaveLength(1);
      } else {
        expect(tasks).toHaveLength(3);
      }
    },
  );
});
