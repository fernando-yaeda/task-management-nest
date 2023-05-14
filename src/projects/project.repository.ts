import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { CreateProjectDTO } from './dto/create-project.dto';
import { Project } from './project.entity';

@Injectable()
export class ProjectRepository extends Repository<Project> {
  constructor(private dataSource: DataSource) {
    super(Project, dataSource.createEntityManager());
  }

  async createProject(
    createProjectDto: CreateProjectDTO,
    user: User,
  ): Promise<Project> {
    const { title, description } = createProjectDto;

    const project = this.create();
    project.title = title;
    project.description = description;
    project.user = user;
    await project.save();

    delete project.user;

    return project;
  }

  async get(user: User): Promise<Project[]> {
    const query = this.createQueryBuilder('project');

    return await query
      .where('project.userId = :userId', { userId: user.id })
      .getMany();
  }
}
