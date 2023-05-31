import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as SwaggerStats from 'swagger-stats';

const init = (app: NestExpressApplication) => {
  const { SWAGGER_TITLE, SWAGGER_PREFIX } = process.env;
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .addBearerAuth()
    .build();
  const swaggerSpec = SwaggerModule.createDocument(app, options);
  app.use(SwaggerStats.getMiddleware({ swaggerSpec }));
  SwaggerModule.setup(`/${SWAGGER_PREFIX}`, app, swaggerSpec);
};

export default init;
