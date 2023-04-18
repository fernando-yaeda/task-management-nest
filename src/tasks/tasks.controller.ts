import { Body, Controller, Get, Post } from '@nestjs/common';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAll(): Task[] {
    return this.tasksService.getAll();
  }

  @Post()
  create(
    @Body('title') title: string,
    @Body('description') description: string,
  ): Task {
    return this.tasksService.create(title, description);
  }
}
