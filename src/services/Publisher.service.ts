import { BullModule, InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ExamplePublisherInput } from 'src/dto/Examples.dto';

const QUEUE_NAME = 'message_driven_demo';

export default BullModule.registerQueue({
  name: QUEUE_NAME,
});

@Injectable()
export class PublisherService {
  constructor(@InjectQueue(QUEUE_NAME) private queue: Queue) {}

  async send(input: ExamplePublisherInput) {
    console.log(
      `Message Driven Arch. sample payload: ${JSON.stringify(input)}`,
    );
    await this.queue.add(input);
  }
}
