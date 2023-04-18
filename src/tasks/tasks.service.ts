import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  async get(filterDto: GetTasksFilterDTO, user: User): Promise<Task[]> {
    return this.taskRepository.get(filterDto, user);
  }

  async getById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async delete(id: number, user: User): Promise<void> {
    const deleteResult = await this.taskRepository.delete({
      id,
      userId: user.id,
    });

    if (deleteResult.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }
  async updateStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getById(id, user);

    return await this.taskRepository.updateStatus(task, status);
  }
}
