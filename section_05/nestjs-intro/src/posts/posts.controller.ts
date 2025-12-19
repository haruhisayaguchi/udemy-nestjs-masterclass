import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PatchPostDto } from './dto/patch-post.dto';

@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService
	) { }

	@Get('{/:userId}')
	public getPosts(@Param("userId") userId: string) {
		return this.postsService.findAll(userId);
	}

	@ApiOperation({
		summary: 'Create a new post'
	})
	@ApiResponse({
		status: 201,
		description: 'The post has been successfully created.'
	})
	@Post()
	public createPost(
		@Body() createPostDto: CreatePostDto
	) {
		return "This action adds a new post"
	}

	@ApiOperation({
		summary: 'Update an existing post'
	})
	@ApiResponse({
		status: 200,
		description: 'The post has been successfully updated.'
	})
	@Patch()
	public updatePost(@Body() patchPostDto: PatchPostDto) {
		console.log(patchPostDto);
	}
}
