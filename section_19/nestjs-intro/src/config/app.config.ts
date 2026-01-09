import { registerAs } from "@nestjs/config"

export default registerAs('app', () => ({
	environment: process.env.NODE_ENV || 'development',
	apiVersion: process.env.API_VERSION,
	awsBucketName: process.env.AWS_PUBLIC_BUCKET_NAME,
	awsRegion: process.env.AWS_REGION,
	awsCloudFrontUrl: process.env.AWS_CLOUD_FRONT_URL,
	awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
	awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	mailHost: process.env.MAIL_HOST,
	smtpUsername: process.env.SMTP_USERNAME,
	smtpPassword: process.env.SMTP_PASSWORD,
}))
