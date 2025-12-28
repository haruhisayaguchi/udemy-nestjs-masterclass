import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { GetUsersParamDto } from "../dtos/get-users-param.dto";
import { AuthService } from "src/auth/providers/auth.service";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { ConfigService, type ConfigType } from "@nestjs/config";
import profileConfig from "../config/profile.config";

/**
 * Users Service
 */
@Injectable()
export class UsersService {
	/**
	 * Constructor
	 * @param authService 
	 */
	constructor(
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		// private readonly configService: ConfigService,
		@Inject(profileConfig.KEY)
		private readonly profileConfiguration: ConfigType<typeof profileConfig>
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
		let newUser = this.usersRepository.create(createUserDto);
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

	/**
	 * Find all users
	 * @param getUsersParamDto 
	 * @param limit 
	 * @param page 
	 * @returns 
	 */
	public findAll(
		getUsersParamDto: GetUsersParamDto,
		limit: number,
		page: number
	) {
		throw new HttpException({
			status: HttpStatus.MOVED_PERMANENTLY,
			error: 'The API endpoint does not exist.'
		}, HttpStatus.MOVED_PERMANENTLY, {
			cause: new Error(),
			description: 'This is description.'
		})
	}

	/**
	 * Find one user by ID
	 * @param id 
	 * @returns 
	 */
	public async findOneById(id: string) {
		let user: User | null;
		try {
			user = await this.usersRepository.findOneBy({ id })
		} catch (error) {
			throw new RequestTimeoutException(
				'Unable to process your request at the moment. Please try later.',
				{
					description: 'Failed to connect to the database.'
				});
		}

		if (!user) {
			throw new BadRequestException('The user id does not exist')
		}

		return user;
	}
}