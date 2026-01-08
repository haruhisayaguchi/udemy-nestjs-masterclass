import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, RequestTimeoutException } from "@nestjs/common";
import { GetUsersParamDto } from "../dtos/get-users-param.dto";
import { AuthService } from "src/auth/providers/auth.service";
import { DataSource, Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";
import { ConfigService, type ConfigType } from "@nestjs/config";
import profileConfig from "../config/profile.config";
import { UsersCreateManyProvider } from "./users-create-many.provider";
import { CreateManyUsersDto } from "../dtos/create-many-users.dto";
import { CreateUserProvider } from "./create-user.provider";
import { FindOneUserByEmailProvider } from "./find-one-user-by-email.provider";
import { FindOneByGoogleIdProvider } from "./find-one-by-google-id.provider";
import { CreateGoogleUserProvider } from "./create-google-user.provider";
import { GoogleUser } from "../interfaces/google-user.interface";

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
		private readonly profileConfiguration: ConfigType<typeof profileConfig>,
		private readonly dataSource: DataSource,
		private readonly usersCreateManyProvider: UsersCreateManyProvider,
		private readonly createUserProvider: CreateUserProvider,
		private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
		private readonly findOneByGoogleIdProvider: FindOneByGoogleIdProvider,
		private readonly createGoogleUserProvider: CreateGoogleUserProvider,
	) { }

	public async createUser(createUserDto: CreateUserDto) {
		return this.createUserProvider.createUser(createUserDto);
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

	public async findOneByEmail(email: string) {
		return await this.findOneUserByEmailProvider.findOneByEmail(email);
	}

	public async findOneByGoogleId(googleId: string) {
		return await this.findOneByGoogleIdProvider.findOneByGoogleId(googleId);
	}

	public async createMany(createManyUsersDto: CreateManyUsersDto) {
		return await this.usersCreateManyProvider.createMany(createManyUsersDto);
	}

	public async createGoogleUser(googleUser: GoogleUser) {
		return await this.createGoogleUserProvider.createGoogleUser(googleUser);
	}
}