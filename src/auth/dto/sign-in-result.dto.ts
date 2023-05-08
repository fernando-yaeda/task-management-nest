import { User } from '../user.entity';

export class SignInResultDTO {
  user: Omit<User, 'password' | 'salt' | 'tasks'>;
  token: string;
}
