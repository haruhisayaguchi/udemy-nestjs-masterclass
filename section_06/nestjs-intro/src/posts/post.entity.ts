import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CreatePostMetaOptionsDto } from "./dto/create-post-meta-options.dto";
import { PostType } from "./enums/post-type.enum";
import { PostStatus } from "./enums/post-status.enum";

@Entity()
export class Post {
	@PrimaryGeneratedColumn()
	id: string;

	@Column({
		type: 'varchar',
		length: 512,
		nullable: false,
	})
	title: string;

	@Column({
		type: 'enum',
		enum: PostType,
		nullable: false,
		default: PostType.POST,
	})
	postType: string;

	@Column({
		type: 'varchar',
		length: 256,
		nullable: false,
		unique: true,
	})
	slug: string;

	@Column({
		type: 'enum',
		enum: PostStatus,
		nullable: false,
		default: PostStatus.DRAFT,
	})
	status: string;

	@Column({
		type: 'text',
		nullable: true,
	})
	content?: string;

	@Column({
		type: 'json',
		nullable: true,
	})
	schema?: string;

	@Column({
		type: 'varchar',
		length: 1024,
		nullable: true,
	})
	featuredImageUrl?: string;

	@Column({
		type: 'timestamp',
		nullable: true,
	})
	publishOn?: Date;

	tags?: string[];
	metaOptions?: CreatePostMetaOptionsDto[];
}