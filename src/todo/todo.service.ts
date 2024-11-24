import {
  CommandService,
  generateId,
  getUserContext,
  IInvoke,
  VERSION_FIRST,
} from '@mbc-cqrs-serverless/core'
import { Injectable, Logger } from '@nestjs/common'

import { generateTodoPk, generateTodoSk, TODO_PK_PREFIX } from '../helpers'
import { CreateTodoDto } from './dto/create-todo.dto'
import { TodoCommandEntity } from './entity/todo-command.entity'
import { TodoDataEntity } from './entity/todo-data.entity'

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name)

  constructor(private readonly commandService: CommandService) {}

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
}
