import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@Injectable()
export class TaskRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description, dueDate, boardId } = createTaskDto;

    const task = this.create();
    task.title = title;
    task.description = description;
    task.dueDate = dueDate && new Date(dueDate);
    task.status = TaskStatus.OPEN;
    task.user = user;
    task.boardId = boardId;
    await task.save();

    delete task.user;

    return task;
  }

  async get(filterDto: GetTasksFilterDTO, user: User): Promise<Task[]> {
    const { status, search, sortBy, orderBy } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sortBy && orderBy) {
      query.orderBy(`task.${sortBy}`, `${orderBy}`);
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async updateStatus(task: Task, status: TaskStatus): Promise<Task> {
    task.status = status;
    await task.save();

    return task;
  }
}
