import FakeUsersRepository from '@repositories/users/FakeUsersRepository';
import AppError from '@errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let service: AuthenticateUserService;
let userService: CreateUserService;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository([]);
    service = new AuthenticateUserService(fakeUsersRepository);
    userService = new CreateUserService(fakeUsersRepository);
  });

  it('should be able to authenticate an existing user.', async () => {
    const user = await userService.execute({
      email: 'test@test.com',
      password: '11111',
      name: 'test',
    });

    const auth = await service.execute({
      email: 'test@test.com',
      password: '11111',
    });

    expect(auth).toBeDefined();
    expect(auth.token).toBeDefined();
    expect(auth.user).toBeDefined();
    expect(auth.user.id).toBe(user.id);
  });

  it('should fail if password is wrong.', async () => {
    await userService.execute({
      email: 'test@test.com',
      password: '11111',
      name: 'test',
    });

    expect(
      service.execute({
        email: 'test@test.com',
        password: '22222',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should fail if email is wrong.', async () => {
    await userService.execute({
      email: 'test@test.com',
      password: '11111',
      name: 'test',
    });

    expect(
      service.execute({
        email: 'test2@test.com',
        password: '11111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
