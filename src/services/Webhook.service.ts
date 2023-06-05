import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ExampleWebhookInput } from 'src/dto/Examples.dto';

@Injectable()
export class WebhookService {
  async send(input: ExampleWebhookInput) {
    const { SLACK_WEBHOOK } = process.env;
    console.log(`Sending message: ${input.text}`);
    await lastValueFrom(
      new HttpService().post(
        SLACK_WEBHOOK,
        { text: input.text },
        { headers: { 'Content-Type': 'application/json' } },
      ),
    );
  }
}
