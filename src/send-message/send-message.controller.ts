import { Controller, Post, Body } from '@nestjs/common';
import { MessageService } from './send-message.service';
import { IMessage, IUpdateMessage } from './message.interface';
import { JoiValidationPipe } from 'src/_common/pipes/joi-validation.pipe';
import schema from './message.schema';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post()
  pushMessageToQueue(@Body(new JoiValidationPipe(schema.addMessage)) input: IUpdateMessage): Promise<IMessage> {
    return this.messageService.pushMessageToQueue(input);
  }
}
