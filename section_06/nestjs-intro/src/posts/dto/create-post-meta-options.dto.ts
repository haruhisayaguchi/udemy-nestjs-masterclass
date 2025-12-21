import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostMetaOptionsDto {
	@ApiProperty({
		description: 'Meta option key',
		example: 'viewport'
	})
	@IsString()
	@IsNotEmpty()
	key: string;

	@ApiProperty({
		description: 'Meta option value',
		example: 'width=device-width, initial-scale=1'
	})
	@IsString()
	@IsNotEmpty()
	value: any;
}