import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import envs from './config/envs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // const port = envs().PORT;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS, // TCP BY DEFAULT
      options: {
        servers: envs().NATS_SERVERS,
      }
    }
  );
  const logger = new Logger('Main');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen();

  logger.debug(`Products microservice is running on PORT: ${envs().PORT} 🚀🚀🚀`);
}
bootstrap();
