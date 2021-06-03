import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.setGlobalPrefix('/api');

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { excludeExtraneousValues: true }
  }));

  await app.listen(3000);
}
bootstrap();
