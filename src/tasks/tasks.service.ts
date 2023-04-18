import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async get(filterDto: GetTasksFilterDTO): Promise<Task[]> {
    return this.taskRepository.get(filterDto);
  }

  async getById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async delete(id: number): Promise<void> {
    const deleteResult = await this.taskRepository.delete(id);

    if (deleteResult.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }
  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getById(id);

    return await this.taskRepository.updateStatus(task, status);
  }
  // updateStatus(id: string, status: TaskStatus): Task {
  //   const task: Task = this.getById(id);
  //   task.status = status;
  //   return task;
  // }
}
