import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { CreateProjectDTO } from './dto/create-project.dto';
import { Project } from './project.entity';
import { ProjectRepository } from './project.repository';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectRepository)
    private readonly projectRepository: ProjectRepository,
  ) {}

  async get(user: User): Promise<Project[]> {
    return this.projectRepository.get(user);
  }

  async getById(id: number, user: User): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async create(
    createProjectDto: CreateProjectDTO,
    user: User,
  ): Promise<Project> {
    return this.projectRepository.createProject(createProjectDto, user);
  }

  async delete(id: number, user: User): Promise<void> {
    const deleteResult = await this.projectRepository.delete({
      id,
      userId: user.id,
    });

    if (deleteResult.affected === 0) {
      throw new NotFoundException('Project not found');
    }
  }
}
