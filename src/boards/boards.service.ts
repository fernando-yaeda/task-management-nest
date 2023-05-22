import { User } from '@/auth/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { CreateBoardDTO } from './dto/create-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private readonly boardRepository: BoardRepository,
  ) {}

  async get(user: User): Promise<Board[]> {
    return this.boardRepository.get(user);
  }

  async getById(id: number, user: User): Promise<Board> {
    const board = await this.boardRepository.findOne({
      // where: { id, userId: user.id },
      where: { id },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  async create(createBoardDto: CreateBoardDTO, user: User): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto, user);
  }

  async delete(id: number, user: User): Promise<void> {
    const deleteResult = await this.boardRepository.delete({
      id,
      // userId: user.id,
    });

    if (deleteResult.affected === 0) {
      throw new NotFoundException('Board not found');
    }
  }
}
