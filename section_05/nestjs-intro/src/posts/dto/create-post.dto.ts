import { IsArray, IsEnum, IsISO8601, IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MinLength, Validate, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PostStatus } from "../enums/post-status.enum";
import { PostType } from "../enums/post-type.enum";
import { CreatePostMetaOptionsDto } from "./create-post-meta-options.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePostDto {
	@ApiProperty({
		description: 'Title of the post',
		example: 'My First Post'
	})
	@IsString()
	@MinLength(4)
	@IsNotEmpty()
	title: string;

	@ApiProperty({
		enum: PostType,
		description: 'Type of the post',
		example: PostType.POST
	})
	@IsEnum(PostType)
	@IsNotEmpty()
	postType: PostType

	@ApiProperty({
		description: 'Slug of the post',
		example: 'my-first-post'
	})
	@IsString()
	@IsNotEmpty()
	@Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
		message: 'Slug can only contain lowercase letters, numbers, and hyphens'
	})
	slug: string;

	@ApiProperty({
		enum: PostStatus,
		description: 'Status of the post',
		example: PostStatus.DRAFT
	})
	@IsEnum(PostStatus)
	@IsNotEmpty()
	status: PostStatus;

	@ApiPropertyOptional({
		description: 'Content of the post',
		example: 'This is the content of my first post.'
	})
	@IsOptional()
	@IsString()
	content?: string;

	@ApiPropertyOptional({
		description: 'Schema in JSON format',
		example: '{"type":"object","properties":{"key":{"type":"string"}}}'
	})
	@IsOptional()
	@IsJSON()
	schema?: string;

	@ApiPropertyOptional({
		description: 'Featured image URL of the post',
		example: 'http://example.com/image.jpg'
	})
	@IsOptional()
	@IsUrl()
	featuredImageUrl?: string;

	@ApiPropertyOptional({
		description: 'Publish date of the post in ISO 8601 format',
		example: '2024-12-31T23:59:59Z'
	})
	@IsOptional()
	@IsISO8601()
	publishOn?: Date;

	@ApiPropertyOptional({
		description: 'Tags associated with the post',
		example: ['nestjs', 'typescript', 'backend']
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@MinLength(3, { each: true })
	tags?: string[];

	@ApiPropertyOptional({
		description: 'Meta options for the post',
		type: [CreatePostMetaOptionsDto]
	})
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreatePostMetaOptionsDto)
	metaOptions?: CreatePostMetaOptionsDto[];
}