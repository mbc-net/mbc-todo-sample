import { DetailDto, IInvoke, INVOKE_CONTEXT } from '@mbc-cqrs-serverless/core'
import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { CreateTodoDto } from './dto/create-todo.dto'
import { TodoDataEntity } from './entity/todo-data.entity'
import { TodoService } from './todo.service'

@Controller('api/todo')
@ApiTags('todo')
export class TodoController {
  private readonly logger = new Logger(TodoService.name)
  constructor(private readonly todoService: TodoService) {}

  @Post('/')
  async create(
    @INVOKE_CONTEXT() invokeContext: IInvoke,
    @Body() createDto: CreateTodoDto,
  ): Promise<TodoDataEntity> {
    this.logger.debug('createDto:', createDto)
    return this.todoService.create(createDto, { invokeContext })
  }

  @Get('/:pk/:sk')
  async findOne(@Param() detailDto: DetailDto): Promise<TodoDataEntity> {
    return this.todoService.findOne(detailDto)
  }
}
