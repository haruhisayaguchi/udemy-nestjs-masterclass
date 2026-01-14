import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from "class-validator";

export class CreateTagDto {
	@ApiProperty()
	@IsString()
	@MinLength(3)
	@MaxLength(256)
	@IsNotEmpty()
	name: string;

	@ApiProperty({
		description: 'Slug of the post',
		example: 'my-first-post'
	})
	@IsString()
	@IsNotEmpty()
	@MaxLength(256)
	@Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
		message: 'Slug can only contain lowercase letters, numbers, and hyphens'
	})
	slug: string;

}