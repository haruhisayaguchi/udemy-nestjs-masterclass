import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsNotEmpty } from "class-validator";

export class CreatePostMetaOptionsDto {
	@ApiProperty({
		description: "The meta value in JSON format",
		example: '{"key":"value"}',
	})
	@IsJSON()
	@IsNotEmpty()
	metaValue: string;
}