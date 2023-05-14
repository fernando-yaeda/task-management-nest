import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { Task } from '../tasks/task.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123456',
  database: 'task-management',
  entities: [__dirname + '../**/*.entity.ts'],
  synchronize: true,
  autoLoadEntities: true,
};

export const typeOrmConfigTest: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123456',
  database: 'task-management-test',
  entities: [Task, User],
  dropSchema: true,
  synchronize: true,
  autoLoadEntities: true,
  keepConnectionAlive: false,
};
