import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class TrackMessageService implements OnModuleInit {

  onModuleInit(): void {
    // console.log('>>>>>>>> stop track message now ...');
    this.trackDelayedMessage();
  }

  constructor(
    @InjectQueue('track-message') private readonly trackMsgQueue: Queue,
  ) { }

  async trackDelayedMessage() {
    await this.trackMsgQueue.add(
      'track-messageJob',
      {},
      {
        repeat: {
          every: 5 * 60 * 1000,
        },
      }
    );
  }
}
