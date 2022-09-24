import { hash } from 'bcryptjs';

import IUserRepository from '@repositories/users/IUsersRepository';
import { ICreateUserDTO } from '@repositories/users/IUserDTO';
import User from '@models/User';
import AppError from '@errors/AppError';
import { classToClass } from 'class-transformer';

export default class CreateUserService {
  constructor(private repository: IUserRepository) {}

  async execute(userData: ICreateUserDTO): Promise<User> {
    const checkUserExists = await this.repository.findByEmail(userData.email);

    if (checkUserExists) {
      throw new AppError('Email address already used');
    }

    const hashedPassword = await hash(userData.password, 8);

    const user = await this.repository.create({
      ...userData,
      password: hashedPassword,
    });

    return classToClass(user);
  }
}
