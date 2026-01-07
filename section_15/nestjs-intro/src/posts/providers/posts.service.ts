import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dto/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';
import { GetPostsDto } from '../dto/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUser } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class PostsService {
	constructor(
		private readonly usersService: UsersService,
		private readonly tagsService: TagsService,
		private readonly paginationProvider: PaginationProvider,
		private readonly createPostProvider: CreatePostProvider,
		@InjectRepository(Post)
		private readonly postsRepository: Repository<Post>,
	) { }

	public async create(
		createPostDto: CreatePostDto,
		user: ActiveUser,
	) {
		return await this.createPostProvider.create(createPostDto, user);
	}

	public async findAll(postQuery: GetPostsDto, userId: string) {
		let posts = await this.paginationProvider.paginateQuery({
			limit: postQuery.limit,
			page: postQuery.page,
		}, this.postsRepository);
		return posts;
	}

	public async update(patchPostDto: PatchPostDto) {
		let tags: Tag[] | null = null;
		let post: Post | null = null;
		try {
			tags = await this.tagsService.findTagsByIds(patchPostDto.tags || []);
		} catch (error) {
			throw new RequestTimeoutException(
				'Unable to process your request at the moment. Please try later.',
				{
					description: 'Failed to connect to the database.'
				});
		}
		if (!tags || tags.length === patchPostDto.tags?.length) {
			throw new BadRequestException('Please check your tag Ids and ensure they are correct.')
		}

		try {
			post = await this.postsRepository.findOneBy({ id: patchPostDto.id });
		} catch (error) {
			throw new RequestTimeoutException(
				'Unable to process your request at the moment. Please try later.',
				{
					description: 'Failed to connect to the database.'
				});
		}
		if (!post) {
			throw new BadRequestException('The post ID does not exist.')
		}

		if (!post) throw new Error('Post not found');
		post.title = patchPostDto.title ?? post.title;
		post.postType = patchPostDto.postType ?? post.postType;
		post.slug = patchPostDto.slug ?? post.slug;
		post.status = patchPostDto.status ?? post.status;
		post.content = patchPostDto.content ?? post.content;
		post.schema = patchPostDto.schema ?? post.schema;
		post.featuredImageUrl = patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
		post.publishOn = patchPostDto.publishOn ?? post.publishOn;
		post.tags = tags;

		return await this.postsRepository.save(post);
	}

	public async delete(id: string) {
		// let post = await this.postsRepository.findOneBy({ id });
		// if (post) {
		await this.postsRepository.delete(id);
		// 	if (post.metaOptions) await this.metaOptionsRepository.delete(post.metaOptions.id);
		// }
		// let inversePost = await this.metaOptionsRepository.find({
		// 	where: { id: post?.metaOptions?.id },
		// 	relations: { post: true },
		// })
		// console.log('inversePost', inversePost);
		return { deleted: true, id }
	}
}
