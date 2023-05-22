import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsValidProjectConstraint } from '../validators/is-valid-project';

export class CreateBoardDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsNotEmpty()
  @IsNumber()
  @Validate(IsValidProjectConstraint)
  projectId: number;
}
