import { Module } from '@nestjs/common';
import { trackMessageProcessor } from './track-message.processor';
import { TrackMessageService } from './track-message.service';
import { RabbitmqModule } from 'src/_common/rabbitmq-config/rabbitmq.module';

@Module({
  imports: [RabbitmqModule],
  providers: [trackMessageProcessor, TrackMessageService],
  exports: [TrackMessageService]
})
export class TrackMessageModule { }
