import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors();

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {prefix: '/uploads'});

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: { excludeExtraneousValues: true }
  }));

  await app.listen(3000);
}
bootstrap();
