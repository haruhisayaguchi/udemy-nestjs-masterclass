import { Body, Controller, Delete, Post, Query } from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagsService } from './providers/tags.service';

@Controller('tags')
export class TagsController {
	constructor(
		private readonly tagsService: TagsService
	) { }

	@Post()
	public create(@Body() createTagDto: CreateTagDto) {
		return this.tagsService.create(createTagDto);
	}

	@Delete()
	public delete(@Query('id') id: string) {
		return this.tagsService.delete(id);
	}

	@Delete('soft')
	public async softDelete(@Query('id') id: string) {
		return this.tagsService.softDelete(id);
	}
}
