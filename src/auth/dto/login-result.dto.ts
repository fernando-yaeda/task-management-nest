import { User } from '../user.entity';

export class LoginResultDTO {
  user: Omit<User, 'password' | 'salt' | 'tasks'>;
  token: string;
}
