import { CommandModule } from '@mbc-cqrs-serverless/core'
import { Module } from '@nestjs/common'

import { TodoController } from './todo.controller'
import { TodoService } from './todo.service'

@Module({
  imports: [
    CommandModule.register({
      tableName: 'todo',
    }),
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
