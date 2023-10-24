import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { UserRegisterDTO } from './dto/user-register.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async signUp(userRegisterDTO: UserRegisterDTO): Promise<void> {
    const { username, firstName, lastName, email, password } = userRegisterDTO;

    const user = this.create();
    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await this.save(user);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(
    userLoginDTO: UserLoginDTO,
  ): Promise<Omit<User, 'password' | 'salt' | 'tasks'> | null> {
    const { email, password } = userLoginDTO;
    const user = await this.findOneBy({ email });

    if (user && (await user.validatePassword(password))) {
      delete user.password;
      delete user.salt;
      delete user.tasks;
      return user;
    } else return null;
  }
}
