import { Board } from '@/boards/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne((_type) => User, (user) => user.projects)
  user: User;

  @OneToMany((_type) => Board, (board) => board.project)
  boards: Board[];

  @Column()
  userId: number;
}
