import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { UserRepository } from '../auth/user.repository';
import { typeOrmConfigTest } from '../config/typeorm.config';
import { CreateProjectDTO } from './dto/create-project.dto';
import { Project } from './project.entity';
import { ProjectRepository } from './project.repository';

const createProjectDataset: CreateProjectDTO[] = [
  {
    title: 'title',
    description: 'description',
  },
  {
    title: 'title',
    description: null,
  },
];

describe('ProjectRepository', () => {
  let userRepository: UserRepository;
  let projectRepository: ProjectRepository;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(typeOrmConfigTest),
        TypeOrmModule.forFeature([Project, User]),
      ],
      providers: [ProjectRepository, UserRepository],
    }).compile();

    projectRepository = module.get<ProjectRepository>(ProjectRepository);
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

  describe('createProject', () => {
    it.each(createProjectDataset)(
      'should return correctly return created project',
      async (createProjectDto: CreateProjectDTO) => {
        jest.spyOn(projectRepository, 'create').mockReturnValue(new Project());

        const project = await projectRepository.createProject(
          createProjectDto,
          user,
        );

        expect(project).toEqual({
          ...createProjectDto,
          id: 1,
          userId: user.id,
        });
        expect(
          projectRepository.find({ where: { id: project.id } }),
        ).resolves.toBeDefined();
      },
    );
  });

  describe('get', () => {
    let userProjects;

    beforeEach(async () => {
      // create user projects
      userProjects = [
        {
          id: 1,
          title: 'title',
          description: 'description',
          userId: user.id,
        },
        {
          id: 2,
          title: 'title',
          description: 'description',
          userId: user.id,
        },
      ];
      await projectRepository.insert(userProjects);

      // creates another user to test that it only returns the requester projects
      await userRepository.insert({
        id: 2,
        username: 'username2',
        email: 'email2@email.com',
        firstName: 'firstName2',
        lastName: 'lastName2',
        password: 'password2',
        salt: 'salt2',
      });

      await projectRepository.insert({
        id: 3,
        title: 'title',
        description: 'description',
        userId: 2,
      });
    });

    it("should return all user's projects", async () => {
      const projects = await projectRepository.get(user);

      expect(projects.length).toEqual(2);
      expect(projects[0]).toEqual(userProjects[0]);
      expect(projects[1]).toEqual(userProjects[1]);
    });
  });
});
