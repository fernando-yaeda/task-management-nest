import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { UserRepository } from '../auth/user.repository';
import { typeOrmConfigTest } from '../config/typeorm.config';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

const dateMock: Date = new Date();
const createCardDataset: CreateTaskDTO[] = [
  {
    title: 'title',
    description: 'description',
    dueDate: dateMock,
  },
  {
    title: 'title',
    description: null,
    dueDate: null,
  },
  {
    title: 'title',
    description: null,
    dueDate: dateMock,
  },
  {
    title: 'title',
    description: 'description',
    dueDate: null,
  },
];

describe('TaskRepository', () => {
  let userRepository: UserRepository;
  let taskRepository: TaskRepository;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfigTest),
        TypeOrmModule.forFeature([Task, User]),
      ],
      providers: [TaskRepository, UserRepository],
    }).compile();

    taskRepository = module.get<TaskRepository>(TaskRepository);
    userRepository = module.get<UserRepository>(UserRepository);

    await userRepository.insert([
      {
        id: 1,
        username: 'username',
        email: 'email@email.com',
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'password',
        salt: 'salt',
      },
    ]);

    user = await userRepository.findOne({ where: { id: 1 } });
  });

  describe('createTask', () => {
    it.each(createCardDataset)(
      'should return correctly return created task',
      async (createTaskDto: CreateTaskDTO) => {
        jest.spyOn(taskRepository, 'create').mockReturnValue(new Task());

        const task = await taskRepository.createTask(createTaskDto, user);

        expect(task).toEqual({
          ...createTaskDto,
          id: 1,
          status: TaskStatus.OPEN,
          userId: user.id,
        });
        expect(
          taskRepository.find({ where: { id: task.id } }),
        ).resolves.toBeDefined();
      },
    );
  });

  describe('get', () => {
    let userTasks;

    beforeEach(async () => {
      // create user tasks
      userTasks = [
        {
          id: 1,
          title: 'title-open',
          description: 'description',
          dueDate: null,
          status: TaskStatus.OPEN,
          userId: user.id,
        },
        {
          id: 2,
          title: 'title-done',
          description: 'description',
          dueDate: null,
          status: TaskStatus.DONE,
          userId: user.id,
        },
      ];
      await taskRepository.insert(userTasks);

      // creates another user to test that it only returns the requester tasks
      await userRepository.insert({
        id: 2,
        username: 'username2',
        email: 'email2@email.com',
        firstName: 'firstName2',
        lastName: 'lastName2',
        password: 'password2',
        salt: 'salt2',
      });

      await taskRepository.insert({
        id: 3,
        title: 'title-open',
        description: 'description',
        dueDate: null,
        status: TaskStatus.OPEN,
        userId: 2,
      });
    });

    it("should return all user's tasks if no filter was provided", async () => {
      const tasks = await taskRepository.get(
        { status: null, search: null },
        user,
      );

      expect(tasks.length).toEqual(2);
      expect(tasks[0]).toEqual(userTasks[0]);
      expect(tasks[1]).toEqual(userTasks[1]);
    });

    it("should return user's tasks by status", async () => {
      const tasks = await taskRepository.get(
        { status: TaskStatus.DONE, search: null },
        user,
      );

      expect(tasks.length).toEqual(1);
      expect(tasks[0]).toEqual(userTasks[1]);
    });

    it("should return user's tasks by search", async () => {
      const tasks = await taskRepository.get(
        { status: null, search: 'title-open' },
        user,
      );

      expect(tasks.length).toEqual(1);
      expect(tasks[0]).toEqual(userTasks[0]);
    });
  });

  describe('updateStatus', () => {
    beforeEach(async () => {
      await taskRepository.insert({
        id: 1,
        title: 'title-open',
        description: 'description',
        status: TaskStatus.OPEN,
        userId: user.id,
      });
    });

    it('should update the status and return the updated task', async () => {
      const task = await taskRepository.findOne({ where: { id: 1 } });

      const updatedTask = await taskRepository.updateStatus(
        task,
        TaskStatus.IN_PROGRESS,
      );

      expect(updatedTask).toEqual({ ...task, status: TaskStatus.IN_PROGRESS });
    });
  });
});
