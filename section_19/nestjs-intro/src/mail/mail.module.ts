import { Global, Module } from '@nestjs/common';
import { MailService } from './providers/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";

@Global()
@Module({
	providers: [MailService],
	imports: [
		MailerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				transport: {
					host: config.get("app.mailHost"),
					secure: false,
					port: 2525,
					auth: {
						user: config.get("app.smtpUsername"),
						passowrd: config.get("app.smtpPassword"),
					}
				},
				default: {
					from: `My Blog <no-reply@nestjs-blog.com>`
				},
				template: {
					dir: join(__dirname, "templates"),
					adapter: new EjsAdapter({
						inlineCssEnabled: true,
					}),
					options: {
						strict: false
					}
				}
			})
		})
	],
	exports: [MailService],
})
export class MailModule { }
