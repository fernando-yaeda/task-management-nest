import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ProjectRepository } from './project.repository';
import { ProjectsService } from './projects.service';

const mockUser = { id: 1, username: 'username1' };

const mockProjectRepository = () => ({
  get: jest.fn(),
  createProject: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

describe('ProjectsService', () => {
  let projectsService;
  let projectRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: ProjectRepository, useFactory: mockProjectRepository },
      ],
    }).compile();

    projectsService = module.get<ProjectsService>(ProjectsService);
    projectRepository = module.get<ProjectRepository>(ProjectRepository);
  });

  describe('get', () => {
    it('should call projectRepository.get() and return the projects', async () => {
      projectRepository.get.mockResolvedValue('value');

      const result = await projectsService.get(mockUser);

      expect(projectRepository.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual('value');
    });
  });

  describe('getById', () => {
    it('should call projectRepository.findOne() and return the project', async () => {
      const mockProject = {
        title: 'project title',
        description: 'project description',
      };
      projectRepository.findOne.mockResolvedValue(mockProject);

      const result = await projectsService.getById(1, mockUser);

      expect(result).toEqual(mockProject);
      expect(projectRepository.findOne).toBeCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });

    it('should throw not found error if projectRepository.findOne() returns null', async () => {
      projectRepository.findOne.mockResolvedValue(null);

      expect(projectsService.getById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should call projectRepository.create() and return the created project', async () => {
      const mockCreateProjectDto = {
        title: 'project title',
        description: 'project description',
      };
      projectRepository.createProject.mockResolvedValue('created project');

      const result = await projectsService.create(
        mockCreateProjectDto,
        mockUser,
      );

      expect(result).toEqual('created project');
      expect(projectRepository.createProject).toHaveBeenCalledWith(
        mockCreateProjectDto,
        mockUser,
      );
    });
  });

  describe('delete', () => {
    it('should call projectRepository.delete() to delete a project', async () => {
      projectRepository.delete.mockResolvedValue({ affected: 1 });

      await projectsService.delete(1, mockUser);
      expect(projectRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('should throw not found error if no project was affected by projectsRepository.delete()', async () => {
      projectRepository.delete.mockResolvedValue({ affected: 0 });

      expect(projectsService.delete(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
