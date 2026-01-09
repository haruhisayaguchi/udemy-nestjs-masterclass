import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Masterclass')
    .setDescription('Use the base API as http://localhost:3000')
    .setTermsOfService('http://nestjs-masterclass.com/terms')
    .setLicense('MIT License', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document)

  // Setup the aws sdk used uploading the files to aws s3 bucket
  const configService = app.get(ConfigService);
  config.update({
    credentials: {
      accessKeyId: configService.get('app.awsAccessKeyId') ?? '',
      secretAccessKey: configService.get('app.awsSecretAccessKey') ?? '',
    },
    region: configService.get('app.awsRegion'),
  })

  // Enable CORS
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
