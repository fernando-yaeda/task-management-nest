import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../auth/user.entity';
import { Board } from './board.entity';
import { CreateBoardDTO } from './dto/create-board.dto';

@Injectable()
export class BoardRepository extends Repository<Board> {
  constructor(private dataSource: DataSource) {
    super(Board, dataSource.createEntityManager());
  }

  async createBoard(
    createBoardDto: CreateBoardDTO,
    user: User,
  ): Promise<Board> {
    const { title, description, projectId } = createBoardDto;

    const board = this.create();
    board.title = title;
    board.description = description;
    // board.project.id = projectId;
    // board.user.id = user.id;
    await board.save();

    // delete board.user;

    return board;
  }

  async get(user: User): Promise<Board[]> {
    const query = this.createQueryBuilder('board');

    return await query
      .where('board.userId = :userId', { userId: user.id })
      .getMany();
  }
}
