import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { ActiveUser } from 'src/auth/interfaces/active-user.interface';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class CreatePostProvider {
	constructor(
		private readonly usersService: UsersService,
		private readonly tagsService: TagsService,
		@InjectRepository(Post)
		private readonly postsRepository: Repository<Post>,
	) { }

	public async create(
		createPostDto: CreatePostDto,
		user: ActiveUser,
	) {
		let author: User | null;
		let tags: Tag[] | null;
		try {
			author = await this.usersService.findOneById(user.sub);
			tags = await this.tagsService.findTagsByIds(createPostDto.tags || []);
		} catch (error) {
			throw new ConflictException(error);
		}
		console.log(tags);

		if (createPostDto.tags?.length !== tags.length) {
			throw new BadRequestException('Please check your tag Ids');
		}

		let post = this.postsRepository.create({ ...createPostDto, author, tags });

		try {
			return await this.postsRepository.save(post);
		} catch (error) {
			throw new ConflictException(error, {
				description: 'Ensure post slug is unique and not duplicated'
			})
		}
	}
}
