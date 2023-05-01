import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepository } from 'src/auth/user.repository';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}
  validate(value: string, args: ValidationArguments) {
    const [fieldName] = args.constraints;

    return this.userRepository
      .findOne({
        where: {
          [fieldName]: value,
        },
      })
      .then((entity) => {
        if (entity) throw new ConflictException(`${fieldName} already in use`);
        return true;
      });
  }
}
