import { ProjectRepository } from '@/projects/project.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidProjectConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(ProjectRepository)
    private readonly projectRepository: ProjectRepository,
  ) {}
  validate(projectId: number) {
    return this.projectRepository
      .findOne({
        where: {
          id: projectId,
        },
      })
      .then((project) => {
        if (!project)
          throw new NotFoundException(`Project ${projectId} not found`);
        return true;
      });
  }
}
