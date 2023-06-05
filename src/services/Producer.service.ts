import { BullModule, InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { ExampleEventProducerInput } from 'src/dto/Examples.dto';

const QUEUE_NAME = 'event_driven_demo';

export default BullModule.registerQueue({
  name: QUEUE_NAME,
});

@Injectable()
export class ProducerService {
  constructor(@InjectQueue(QUEUE_NAME) private queue: Queue) {}

  async send(input: ExampleEventProducerInput) {
    console.log(`Event Driven Arch. sample payload: ${JSON.stringify(input)}`);
    await this.queue.client.xadd(
      QUEUE_NAME,
      '*',
      'text',
      input.text,
      'digits',
      input.digits,
    );
  }
}
