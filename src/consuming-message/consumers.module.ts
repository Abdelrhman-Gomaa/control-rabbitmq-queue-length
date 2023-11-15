import { Module } from '@nestjs/common';
import { RabbitmqModule } from 'src/_common/rabbitmq-config/rabbitmq.module';
import { ConsumerService } from './consumer.service';

@Module({
	imports: [
		RabbitmqModule,
	],
	providers: [ConsumerService],
	exports: [ConsumerService]
})
export class ConsumersModule { }
