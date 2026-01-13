import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";

export async function dropDatabase(configService: ConfigService): Promise<void> {
	// Create the connection to datasource
	const AppDataSource = await new DataSource({
		type: 'postgres',
		host: configService.get<string>('database.host'),
		port: configService.get<number>('database.port'),
		username: configService.get<string>('database.username'),
		password: configService.get<string>('database.password'),
		database: configService.get<string>('database.name'),
		synchronize: configService.get<boolean>('database.synchronize'),
	}).initialize();
	// Drop all tables
	await AppDataSource.dropDatabase();
	// Close the connection
	await AppDataSource.destroy();
}