import 'dotenv/config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError, useContainer } from 'class-validator';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ApiConfigService } from './shared/api-config.service';
import { SharedModule } from './shared/shared.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const config = new DocumentBuilder()
    .setTitle('Triangle API')
    .setDescription('task management api')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useLogger(app.get(Logger));

  app.useGlobalInterceptors(new LoggerErrorInterceptor());

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
  await app.listen(port || 3003);

  console.log(`listening on ${process.env.PORT}`);
}
bootstrap();
