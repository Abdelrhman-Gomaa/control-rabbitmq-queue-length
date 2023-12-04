import { Module } from '@nestjs/common';
import { trackMessageProcessor } from './track-message.processor';
import { TrackMessageService } from './track-message.service';
import { RabbitmqModule } from 'src/_common/rabbitmq-config/rabbitmq.module';
import { MessageModule } from 'src/send-message/send-message.module';

@Module({
  imports: [RabbitmqModule, MessageModule],
  providers: [trackMessageProcessor, TrackMessageService],
  exports: [TrackMessageService]
})
export class TrackMessageModule {}
