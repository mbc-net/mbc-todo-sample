import {
  DetailDto,
  getUserContext,
  IInvoke,
  INVOKE_CONTEXT,
  SearchDto,
} from '@mbc-cqrs-serverless/core'
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common'
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

  @Get('/')
  async findAll(
    @INVOKE_CONTEXT() invokeContext: IInvoke,
    @Query() searchDto: SearchDto,
  ) {
    this.logger.debug('searchDto:', searchDto)
    const { tenantCode } = getUserContext(invokeContext)
    return await this.todoService.findAll(tenantCode, searchDto)
  }

  @Get('/:pk/:sk')
  async findOne(@Param() detailDto: DetailDto): Promise<TodoDataEntity> {
    return this.todoService.findOne(detailDto)
  }
}
