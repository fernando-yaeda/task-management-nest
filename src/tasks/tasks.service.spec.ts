import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = { id: 1, username: 'username1' };

const mockTaskRepository = () => ({
  get: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
  updateStatus: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('get', () => {
    it('should call taskRepository.get() and return the tasks', async () => {
      taskRepository.get.mockResolvedValue('value');

      const filters: GetTasksFilterDTO = {
        status: TaskStatus.OPEN,
        search: 'query',
      };

      const result = await tasksService.get(filters, mockUser);

      expect(taskRepository.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual('value');
    });
  });

  describe('getById', () => {
    it('should call taskRepository.findOne() and return the task', async () => {
      const mockTask = {
        title: 'task title',
        description: 'task description',
      };
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getById(1, mockUser);

      expect(result).toEqual(mockTask);
      expect(taskRepository.findOne).toBeCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });

    it('should throw not found error if taskRepository.findOne() returns null', async () => {
      taskRepository.findOne.mockResolvedValue(null);

      expect(tasksService.getById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should call taskRepository.create() and return the created task', async () => {
      const mockCreateTaskDto = {
        title: 'task title',
        description: 'task description',
      };
      taskRepository.createTask.mockResolvedValue('created task');

      const result = await tasksService.create(mockCreateTaskDto, mockUser);

      expect(result).toEqual('created task');
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        mockCreateTaskDto,
        mockUser,
      );
    });
  });

  describe('delete', () => {
    it('should call taskRepository.delete() to delete a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });

      await tasksService.delete(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('should throw not found error if no task was affected by tasksRepository.delete()', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });

      expect(tasksService.delete(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('should call taskRepository.updateStatus() and return the updated task', async () => {
      const taskMock = {
        id: 1,
        title: 'task title',
        description: 'task description',
        status: TaskStatus.OPEN,
      };
      tasksService.getById = jest.fn().mockResolvedValue(taskMock);
      taskRepository.updateStatus.mockResolvedValue('updated task');

      const result = await tasksService.updateStatus(
        taskMock.id,
        TaskStatus.DONE,
        mockUser,
      );

      expect(result).toEqual('updated task');
      expect(tasksService.getById).toHaveBeenCalledWith(taskMock.id, mockUser);
      expect(taskRepository.updateStatus).toHaveBeenCalledWith(
        taskMock,
        TaskStatus.DONE,
      );
    });
  });
});
