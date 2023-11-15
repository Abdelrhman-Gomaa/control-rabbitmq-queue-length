import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { rabbitmqConfig } from './rabbitmq.config';
import { connect, Connection, Channel } from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: Connection;
  private channel: Channel;

  // onModuleInit(): void {
  //   this.connect();
  // }

  async connect(): Promise<void> {
    try {
      this.connection = await connect({
        hostname: rabbitmqConfig.hostname,
        port: rabbitmqConfig.port,
        username: rabbitmqConfig.username,
        password: rabbitmqConfig.password,
      });
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(rabbitmqConfig.exchange, 'direct', { durable: true });
      rabbitmqConfig.queues.map(async queue => {
        await this.channel.assertQueue(queue.name, { durable: true, maxPriority: 10, maxLength: 100 });
        await this.channel.bindQueue(queue.name, rabbitmqConfig.exchange, queue.routingKey, { 'x-max-priority': 10, 'x-max-length': 100 });
      });
      Logger.log('RabbitMQ connection is initialized ...');
    } catch (error) {
      console.error('An error occurred while connecting to RabbitMQ:', error);
      throw error;
    }
  }

  async publishMessage(message: string, routingKey: string, queue: string, priority?): Promise<void> {
    try {
      if (!this.channel) this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(rabbitmqConfig.exchange, 'direct', { durable: true });
      if (queue) await this.channel.assertQueue(queue, { durable: true, maxPriority: 10, maxLength: 100 });
      if (queue && routingKey) await this.channel.bindQueue(queue, rabbitmqConfig.exchange, routingKey);
      await this.channel.publish(rabbitmqConfig.exchange, routingKey, Buffer.from(message), { priority });
    } catch (error) {
      console.error('An error occurred while publishing a message to RabbitMQ:', error);
      throw error;
    }
  }

  async consumeMessages(queue: string, callback: (message: string) => void): Promise<void> {
    try {
      if (!this.channel) {
        throw new Error('RabbitMQ channel is not initialized');
      }
      await this.channel.consume(queue, (msg) => {
        if (msg) {
          const message = msg.content.toString();
          callback(message);
          this.channel.ack(msg);
        }
      });
    } catch (error) {
      console.error('An error occurred while consuming messages from RabbitMQ:', error);
      throw error;
    }
  }

  async getQueue(queue: string) {
    return await this.channel.checkQueue(queue);
  }
}