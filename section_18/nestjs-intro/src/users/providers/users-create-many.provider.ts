import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
	constructor(
		private readonly dataSource: DataSource,
	) { }

	public async createMany(createManyUsersDto: CreateManyUsersDto) {
		let newUsers: User[] = [];

		// create query runner instance
		const queryRunner = this.dataSource.createQueryRunner();
		try {
			// connect query runner to database
			await queryRunner.connect();
			// start transaction
			await queryRunner.startTransaction();
		} catch (error) {
			throw new RequestTimeoutException('Could not connect to the database.')
		}

		try {
			for (const user of createManyUsersDto.users) {
				let newUser = queryRunner.manager.create(User, user);
				let result = await queryRunner.manager.save(newUser);
				newUsers.push(result);
			}
			// if successful commit
			await queryRunner.commitTransaction();
		} catch (error) {
			// if unsuccessful rollback
			await queryRunner.rollbackTransaction();
			throw new ConflictException('Could not complete the transaction.', {
				description: String(error),
			})
		} finally {
			// release connection
			await queryRunner.release();
		}
		return { users: newUsers };
	}
}
