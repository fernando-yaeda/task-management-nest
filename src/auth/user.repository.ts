import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async signUp(authCredentialsDto: AuthCredentialsDTO): Promise<void> {
    const { username, firstName, lastName, email, password } =
      authCredentialsDto;

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
    authCredentialsDto: AuthCredentialsDTO,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOneBy({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else return null;
  }
}
