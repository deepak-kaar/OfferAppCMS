/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
  origin: 'http://localhost:4200',
  methods: 'GET,POST,PUT,PATCH,DELETE',
  credentials: true,
});


  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Offer App API')
    .setDescription('API documentation for the Offer App - Vendor and Offer Management System')
    .setVersion('1.0')
    .addTag('vendor', 'Vendor management endpoints')
    .addServer(`http://localhost:${process.env.PORT || 3000}`, 'Local Development')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'JWT token obtained from /admin/login',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `📚 Swagger documentation available at: http://localhost:${port}/api/docs`,
  );
}

bootstrap();
