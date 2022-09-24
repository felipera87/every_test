import { getRepository, Repository } from 'typeorm';
import User from '@models/User';
import IUsersRepository from './IUsersRepository';
import { ICreateUserDTO } from './IUserDTO';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  async create(userData: ICreateUserDTO): Promise<User> {
    const { email, name, password, isAdmin: is_admin } = userData;
    const user = this.ormRepository.create({
      email,
      name,
      password,
      is_admin,
    });

    await this.ormRepository.save(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });

    return user;
  }
}

export default UsersRepository;
