import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { Task } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAll(): Task[] {
    return this.tasksService.getAll();
  }

  @Get('/:id')
  GetById(@Param('id') id: string): Task {
    return this.tasksService.getById(id);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDTO): Task {
    return this.tasksService.create(createTaskDto);
  }
}
