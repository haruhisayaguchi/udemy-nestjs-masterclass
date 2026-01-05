import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { CreatePostDto } from "./create-post.dto";
// import { PartialType } from "@nestjs/mapped-types";

export class PatchPostDto extends PartialType(CreatePostDto) {
	@ApiProperty({
		description: 'ID of the post to be updated',
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsString()
	@IsNotEmpty()
	id: string;
}