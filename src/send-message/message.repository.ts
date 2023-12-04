import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'objectionjs-repository';
import { IMessage } from './message.interface';
import { Knex } from 'knex';
import * as R from 'ramda';
import MessageModel from './message.model';
import { NotFoundException } from 'expressjs-errors-handler';

@Injectable()
export class MessageRepository extends BaseRepository<IMessage> {
  constructor(@Inject('KnexConnection') knexInstance: Knex) {
    super(MessageModel, knexInstance);
  }

  async messageOrError(conditions: Partial<IMessage>, options?: any) {
    const message: IMessage | undefined = await this.getOne(conditions, options);
    if (R.isNil(message)) {
      throw new NotFoundException([{ message: 'message not found' }]);
    }
    return message;
  }
}
