import { BadRequestException, forwardRef, Inject, Injectable, RequestTimeoutException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
	constructor(
		@Inject(forwardRef(() => HashingProvider))
		private readonly hashingProvider: HashingProvider,
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) { }

	public async createUser(createUserDto: CreateUserDto) {
		let existingUser: User | null;
		try {
			// check if user with email already exists
			existingUser = await this.usersRepository.findOne({
				where: { email: createUserDto.email },
			})
		} catch (error) {
			throw new RequestTimeoutException(
				'Unable to process your request at the moment. Please try later.',
				{
					description: 'Failed to connect to the database.'
				}
			);
		}
		// handle exception
		if (existingUser) {
			throw new BadRequestException('The user already exists, please check your email.');
		}

		// create a new user
		let newUser = this.usersRepository.create({
			...createUserDto,
			password: await this.hashingProvider.hashPassword(createUserDto.password),
		});
		try {
			newUser = await this.usersRepository.save(newUser);
		} catch (error) {
			throw new RequestTimeoutException(
				'Unable to process your request at the moment. Please try later.',
				{
					description: 'Failed to connect to the database.'
				});
		}
		return newUser;
	}

}
