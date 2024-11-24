import {
  CommandService,
  DataService,
  DetailDto,
  generateId,
  getUserContext,
  IInvoke,
  VERSION_FIRST,
} from '@mbc-cqrs-serverless/core'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'

import { generateTodoPk, generateTodoSk, TODO_PK_PREFIX } from '../helpers'
import { CreateTodoDto } from './dto/create-todo.dto'
import { TodoCommandEntity } from './entity/todo-command.entity'
import { TodoDataEntity } from './entity/todo-data.entity'

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name)

  constructor(
    private readonly commandService: CommandService,
    private readonly dataService: DataService,
  ) {}

  async create(
    createDto: CreateTodoDto,
    opts: { invokeContext: IInvoke },
  ): Promise<TodoDataEntity> {
    const { tenantCode } = getUserContext(opts.invokeContext)
    const pk = generateTodoPk(tenantCode)
    const sk = generateTodoSk()
    const todo = new TodoCommandEntity({
      pk,
      sk,
      id: generateId(pk, sk),
      tenantCode,
      code: sk,
      type: TODO_PK_PREFIX,
      version: VERSION_FIRST,
      name: createDto.name,
      attributes: createDto.attributes,
    })
    const item = await this.commandService.publish(todo, opts)
    return new TodoDataEntity(item as TodoDataEntity)
  }

  async findOne(detailDto: DetailDto): Promise<TodoDataEntity> {
    const item = await this.dataService.getItem(detailDto)
    if (!item) {
      throw new NotFoundException('Task not found!')
    }
    this.logger.debug('item:', item)
    return new TodoDataEntity(item as TodoDataEntity)
  }
}
