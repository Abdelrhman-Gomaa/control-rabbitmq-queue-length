import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/_common/rabbitmq-config/rabbitmq.service';
import { MessageRepository } from 'src/send-message/message.repository';
import { messageTypeEnum } from 'src/send-message/send-message.enum';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private isConnected: boolean = false;
  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly rabbitmqService: RabbitMQService
  ) {}

  onModuleInit(): void {
    console.log('>>>>>>>> Stop Consuming Now ...');
    // this.startConsuming();
  }

  async startConsuming(): Promise<void> {
    try {
      await this.rabbitmqService.connect();
      this.isConnected = true;
      // let notificationPayload
      await this.rabbitmqService.consumeMessages(process.env.RABBITMQ_QUEUE, async message => {
        const msg = JSON.parse(message);

        await this.messageRepo.update(
          { id: msg.id },
          {
            type: messageTypeEnum.success,
            resolvedAt: new Date().toISOString()
          }
        );
        console.log(msg.content);
      });
    } catch (error) {
      console.log('>>>>>>>> startConsuming', error);
      this.isConnected = false;
      setTimeout(() => this.startConsuming(), 5000);
      // throw error
    }
  }
}
