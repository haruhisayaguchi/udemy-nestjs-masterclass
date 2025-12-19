import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class PostsService {
	constructor(
		private readonly usersService: UsersService
	) { }

	public findAll(userId: string) {
		const user = this.usersService.findOneById(userId);

		return [
			{
				user,
				title: "title1",
				content: "content1"
			},
			{
				user,
				title: "title2",
				content: "content2"
			},
		]
	}
}
