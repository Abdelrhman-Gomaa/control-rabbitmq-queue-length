import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/_common/rabbitmq-config/rabbitmq.service';
import { messageTypeEnum } from './send-message.enum';
import { MessageRepository } from './message.repository';
import { IMessage } from './message.interface';

@Injectable()
export class MessageService implements OnModuleInit {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly rabbitmqService: RabbitMQService
  ) {}

  onModuleInit(): void {
    this.rabbitmqService.connect();
  }

  async pushMessageToQueue(data: any): Promise<IMessage> {
    const queue = await this.rabbitmqService.getQueue(process.env.RABBITMQ_QUEUE);
    if (queue.messageCount >= 10) {
      return await this.messageRepository.create({
        ...data,
        isPublished: false,
        type: messageTypeEnum.pending
      });
    } else {
      const message = await this.messageRepository.create({
        ...data,
        isPublished: true,
        type: messageTypeEnum.pending
      });
      const payload = JSON.stringify({
        id: message.id,
        to: message.to,
        from: message.from,
        content: message.content
      });
      await this.rabbitmqService.publishMessage(
        payload,
        process.env.RABBITMQ_ROUTING_KEY,
        process.env.RABBITMQ_QUEUE
      );
      return message;
    }
  }
}
