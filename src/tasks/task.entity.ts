import { User } from '@/auth/user.entity';
import { Board } from '@/boards/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, type: 'timestamptz' })
  dueDate: Date;

  @Column()
  status: TaskStatus;

  @ManyToOne((type) => User, (user) => user.tasks, { eager: false })
  user: User;

  @ManyToOne((type) => Board, (board) => board.tasks, { eager: false })
  board: Board;

  @Column()
  boardId: number;

  @Column()
  userId: number;
}
