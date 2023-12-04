import { InjectQueue, OnGlobalQueueActive, OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { RabbitMQService } from 'src/_common/rabbitmq-config/rabbitmq.service';
import { MessageRepository } from 'src/send-message/message.repository';
import { messageTypeEnum } from 'src/send-message/send-message.enum';

@Processor('track-message')
export class trackMessageProcessor {
  constructor(
    private readonly rabbitmqService: RabbitMQService,
    private readonly messageRepo: MessageRepository,
    @InjectQueue('track-message') private readonly trackMsgQueue: Queue
  ) {}

  @Process('track-messageJob')
  async handle() {
    console.log('-------- messageJob Handler --------');
    return await this.process();
  }

  @OnQueueActive()
  async onQueueActive(job: Job) {
    console.log('-------- messageJob onQueueActive --------');
    if (!(await job?.finished())) await this.process();
  }

  @OnGlobalQueueActive()
  async onGlobalQueueActive(jobId: string) {
    console.log('-------- messageJob OnGlobalQueueActive --------');
    const job = await this.trackMsgQueue.getJob(jobId);
    if (!(await job?.finished())) {
      await this.process();
    }
  }

  private async process() {
    const jobCase = {
      statusChanged: false
    };
    console.log('-------- track-messageJob process --------');
    try {
      const queue = await this.rabbitmqService.getQueue(process.env.RABBITMQ_QUEUE);

      if (queue.messageCount >= 10) {
        jobCase.statusChanged = true;
        return;
      } else {
        // get pending message not sent to queue from db
        const pendingMessage = await this.messageRepo.getAll({
          type: messageTypeEnum.pending,
          isPublished: false
        });
        // calculate space free in queue
        const spaceFreeInQueue = 10 - queue.messageCount;

        const messagesIds = [];
        // check if space free in queue less than messages in db
        if (pendingMessage.length > spaceFreeInQueue) {
          console.log('>>>>>>>>>> pendingMessage.length > spaceFreeInQueue');
          // for loop for sending just message equal space free in queue
          for (let i = 0; i < spaceFreeInQueue; i++) {
            const message = pendingMessage[i];
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
            messagesIds.push(message.id);
          }
          // update message have sent to queue in db to be a true
          await this.messageRepo.update(
            {},
            { isPublished: true },
            { whereIn: [{ field: 'id', values: messagesIds }] }
          );
        } else {
          console.log('>>>>>>>>>> spaceFreeInQueue');
          // send all messages pending in db to queue
          pendingMessage.map(async message => {
            const payload = JSON.stringify({
              id: message.id,
              to: message.to,
              from: message.from,
              content: message.content
            });
            messagesIds.push(message.id);
            await this.rabbitmqService.publishMessage(
              payload,
              process.env.RABBITMQ_ROUTING_KEY,
              process.env.RABBITMQ_QUEUE
            );
          });
          await this.messageRepo.update(
            {},
            { isPublished: true },
            { whereIn: [{ field: 'id', values: messagesIds }] }
          );
        }
      }
      jobCase.statusChanged = true;
    } catch (error) {
      console.log('Error -> ', error);
    } finally {
      return jobCase.statusChanged;
    }
  }
}
