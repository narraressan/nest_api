import { Body, Controller, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRoleEnum } from 'src/db/entities/Base';
import {
  ExampleWebhookInput,
  ExamplePublisherInput,
  ExampleEventProducerInput,
} from 'src/dto/Examples.dto';
import { IsPrivateApi } from 'src/guards/Auth.guard';
import { UserRoles, UserRolesGuard } from 'src/guards/Roles.guard';
import { ProducerService } from 'src/services/Producer.service';
import { PublisherService } from 'src/services/Publisher.service';
import { WebhookService } from 'src/services/Webhook.service';

@ApiTags('Example Endpoints')
@ApiBearerAuth()
@UserRoles(UserRoleEnum.ADMIN, UserRoleEnum.MANAGEMENT, UserRoleEnum.USER)
@UseGuards(IsPrivateApi, UserRolesGuard)
@Controller()
export class ExamplesController {
  constructor(
    private readonly webHook: WebhookService,
    private readonly publisher: PublisherService,
    private readonly producer: ProducerService,
  ) {}

  @Put('webhook')
  async webhook(@Body() input: ExampleWebhookInput) {
    await this.webHook.send(input);
    return HttpStatus.OK;
  }

  @Put('publish')
  async publish(@Body() input: ExamplePublisherInput) {
    await this.publisher.send(input);
    return HttpStatus.OK;
  }

  @Put('produce')
  async produce(@Body() input: ExampleEventProducerInput) {
    await this.producer.send(input);
    return HttpStatus.OK;
  }
}
