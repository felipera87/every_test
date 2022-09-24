import FakeUsersRepository from '@repositories/users/FakeUsersRepository';
import AppError from '@errors/AppError';
import CreateUserservice from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let service: CreateUserservice;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository([]);
    service = new CreateUserservice(fakeUsersRepository);
  });

  it('should be able to create a user.', async () => {
    const user = await service.execute({
      email: 'test@test.com',
      password: '11111',
      name: 'test',
    });

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@test.com');
    expect(user.password).not.toBe('11111');
    expect(user.name).toBe('test');
  });

  it.each([true, false])(
    'should be able to create a user with isAdmin parameter: %s',
    async isAdmin => {
      const user = await service.execute({
        email: 'test@test.com',
        password: '11111',
        name: 'test',
        isAdmin,
      });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@test.com');
      expect(user.password).not.toBe('11111');
      expect(user.name).toBe('test');
      expect(user.is_admin).toBe(isAdmin);
    },
  );

  it('should not be able to create user with duplicate email.', async () => {
    await service.execute({
      email: 'test@test.com',
      password: '11111',
      name: 'test',
    });

    expect(
      service.execute({
        email: 'test@test.com',
        password: '11111',
        name: 'test2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
