import { IsEnum, IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { taskOrderBy } from '../task-order-by.enum';
import { TaskStatus } from '../task-status.enum';

export class GetTasksFilterDTO {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;

  @IsOptional()
  @IsEnum(taskOrderBy)
  sortBy: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderBy: 'ASC' | 'DESC';
}
