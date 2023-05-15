import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError, useContainer } from 'class-validator';
import 'dotenv/config';
import { AppModule } from './app.module';
import { ApiConfigService } from './shared/api-config.service';
import { SharedModule } from './shared/shared.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[]) => {
        const errorMessage = validationErrors[0]?.constraints?.matches;
        if (errorMessage) {
          throw new BadRequestException(errorMessage);
        }
      },
      stopAtFirstError: true,
    }),
  );

  app.enableCors();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const configService = app.select(SharedModule).get(ApiConfigService);

  const port = configService.appConfig.port;
  await app.listen(port || 3000);

  console.log(`listening on ${process.env.PORT}`);
}
bootstrap();
