import UsersRepository from '@repositories/users/UsersRepository';
import AuthenticateUserService from '@services/AuthenticateUserService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
// import { classToClass } from 'class-transformer';

// import AuthenticateUserService from '@services/AuthenticateUserService';

export default class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const usersRepository = new UsersRepository();
    const service = new AuthenticateUserService(usersRepository);

    const { user, token } = await service.execute({
      email,
      password,
    });

    return res.json({ user: classToClass(user), token });
  }
}
