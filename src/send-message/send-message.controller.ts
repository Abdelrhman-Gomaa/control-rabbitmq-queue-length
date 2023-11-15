import { Controller, Post, Body } from '@nestjs/common';
import { MessageService } from './send-message.service';
import { SendMessageInput } from './input/send-message.input';
import { Message } from './models/message.model';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post()
  pushMessageToQueue(@Body() input: SendMessageInput): Promise<Message> {
    return this.messageService.pushMessageToQueue(input);
  }
}
