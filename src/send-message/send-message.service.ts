import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/_common/rabbitmq-config/rabbitmq.service';
import { SendMessageInput } from './input/send-message.input';
import { Message } from './models/message.model';
import { messageTypeEnum } from './send-message.enum';

@Injectable()
export class MessageService implements OnModuleInit {

  constructor(private readonly rabbitmqService: RabbitMQService) { }

  onModuleInit(): void {
    this.rabbitmqService.connect();
  }

  async pushMessageToQueue(input: SendMessageInput): Promise<Message> {
    const queue = await this.rabbitmqService.getQueue(process.env.RABBITMQ_QUEUE);
    if (queue.messageCount >= 10) {
      return await Message.query().insert({
        ...input,
        isPublished: false,
        type: messageTypeEnum.pending
      });
    } else {
      const message = await Message.query().insert({
        ...input,
        isPublished: true,
        type: messageTypeEnum.pending
      });
      const payload = JSON.stringify({
        id: message.id,
        to: message.to,
        from: message.from,
        content: message.content,
      });
      await this.rabbitmqService.publishMessage(payload, process.env.RABBITMQ_ROUTING_KEY, process.env.RABBITMQ_QUEUE);
      return message;
    }
  }

}