import { IsInt, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class GetUsersParamDto {
	@ApiPropertyOptional({
		description: 'Get user with a spcific ID',
		example: 1234,
	})
	@IsOptional()
	@IsString()
	id?: string;
}