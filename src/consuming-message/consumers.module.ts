import { Module } from '@nestjs/common';
import { RabbitmqModule } from 'src/_common/rabbitmq-config/rabbitmq.module';
import { ConsumerService } from './consumer.service';
import { MessageModule } from 'src/send-message/send-message.module';

@Module({
	imports: [
		RabbitmqModule,
		MessageModule
	],
	providers: [ConsumerService],
	exports: [ConsumerService]
})
export class ConsumersModule { }
