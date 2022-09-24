import User from '@models/User';
import { ICreateUserDTO } from './IUserDTO';

export default interface IUsersRepository {
  findByEmail(email: string): Promise<User | null>;
  create(userData: ICreateUserDTO): Promise<User | null>;
}
