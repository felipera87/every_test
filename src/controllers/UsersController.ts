import UsersRepository from '@repositories/users/UsersRepository';
import CreateUserService from '@services/CreateUserService';
import { Request, Response } from 'express';

export default class UsersController {
  async index(req: Request, res: Response): Promise<Response> {
    return res.json({});
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password, isAdmin } = req.body;

    const repository = new UsersRepository();
    const service = new CreateUserService(repository);

    const user = await service.execute({
      name,
      email,
      password,
      isAdmin,
    });

    return res.json(user);
  }
}
