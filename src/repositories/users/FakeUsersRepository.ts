import { v4 as uuid } from 'uuid';
import User from '@models/User';
import { ICreateUserDTO } from './IUserDTO';
import IUsersRepository from './IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
  constructor(private users: User[]) {}

  async findByEmail(email: string): Promise<User> {
    const foundUser = this.users.find(user => user.email === email);
    return foundUser;
  }

  async create(userData: ICreateUserDTO): Promise<User> {
    const { email, name, password, isAdmin } = userData;
    const newUser: User = {
      id: uuid(),
      email,
      name,
      is_admin: isAdmin,
      password,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }
}

export default FakeUsersRepository;
