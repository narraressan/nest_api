import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ExampleWebhookInput {
  @ApiProperty()
  @IsString()
  text: string;
}

export class ExamplePublisherInput {
  @ApiProperty()
  @IsString()
  text: string;
}

export class ExampleEventProducerInput {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsNumber()
  digits: number;
}
