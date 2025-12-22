import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dto/patch-post.dto';

@Injectable()
export class PostsService {
	constructor(
		private readonly usersService: UsersService,
		private readonly tagsService: TagsService,
		@InjectRepository(Post)
		private readonly postsRepository: Repository<Post>,
	) { }

	public async create(
		createPostDto: CreatePostDto
	) {
		let author = await this.usersService.findOneById(createPostDto.authorId);
		let tags = await this.tagsService.findTagsByIds(createPostDto.tags || []);
		let post = this.postsRepository.create({ ...createPostDto, author, tags });
		return await this.postsRepository.save(post);
	}

	public async findAll() {
		let posts = await this.postsRepository.find({
			relations: {
				metaOptions: false,
				author: true,
				tags: true,
			}
		});
		return posts;
	}

	public async update(patchPostDto: PatchPostDto) {
		let tags = await this.tagsService.findTagsByIds(patchPostDto.tags || []);
		let post = await this.postsRepository.findOneBy({ id: patchPostDto.id });
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
