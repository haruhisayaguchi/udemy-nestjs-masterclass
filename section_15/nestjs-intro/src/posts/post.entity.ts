import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PostType } from "./enums/post-type.enum";
import { PostStatus } from "./enums/post-status.enum";
import { MetaOption } from "src/meta-options/meta-options.entity";
import { User } from "src/users/user.entity";
import { Tag } from "src/tags/tag.entity";

@Entity()
export class Post {
	@PrimaryGeneratedColumn('uuid')
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

	@OneToOne(() => MetaOption, (metaOptions) => metaOptions.post, {
		cascade: true,
	})
	metaOptions?: MetaOption;

	@ManyToOne(() => User, (user) => user.posts, {
	})
	author: User | null;

	@ManyToMany(() => Tag, (tag) => tag.posts, {
		eager: true,
	})
	@JoinTable()
	tags?: Tag[];
}