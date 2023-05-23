import { GetUser } from '@/auth/get-user.decorator';
import { User } from '@/auth/user.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Board } from './board.entity';
import { BoardsService } from './boards.service';
import { CreateBoardDTO } from './dto/create-board.dto';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  get(@GetUser() user: User): Promise<Board[]> {
    return this.boardsService.get(user);
  }

  @Get('/:id')
  getById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardsService.getById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(
    @Body() createBoardDto: CreateBoardDTO,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardsService.create(createBoardDto, user);
  }

  @Delete('/:id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boardsService.delete(id, user);
  }
}
