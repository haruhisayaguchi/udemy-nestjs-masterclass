import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';

export function appCreate(app: INestApplication) {
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
}