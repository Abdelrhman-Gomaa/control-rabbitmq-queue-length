import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/_common/database/database.module';
import { RabbitmqModule } from 'src/_common/rabbitmq-config/rabbitmq.module';
import { MessageController } from './send-message.controller';
import { MessageService } from './send-message.service';
import { MessageRepository } from './message.repository';

@Module({
  imports: [DatabaseModule, RabbitmqModule],
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
  exports: [MessageService, MessageRepository]
})
export class MessageModule {}
