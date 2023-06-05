import { Module } from '@nestjs/common';
import { ExamplesController } from 'src/controllers/Examples.controller';
import EventDrivenQueue, {
  ProducerService,
} from 'src/services/Producer.service';
import MessageDrivenQueue, {
  PublisherService,
} from 'src/services/Publisher.service';
import { WebhookService } from 'src/services/Webhook.service';

@Module({
  imports: [MessageDrivenQueue, EventDrivenQueue],
  controllers: [ExamplesController],
  providers: [WebhookService, PublisherService, ProducerService],
})
export class ExamplesModule {}
