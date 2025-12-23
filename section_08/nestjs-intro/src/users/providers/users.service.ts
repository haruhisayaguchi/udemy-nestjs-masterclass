import { forwardRef, Inject, Injectable } from "@nestjs/common";
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
		// check if user with email already exists
		const existingUser = await this.usersRepository.findOne({
			where: { email: createUserDto.email },
		})
		// handle exception
		// create a new user
		let newUser = this.usersRepository.create(createUserDto);
		newUser = await this.usersRepository.save(newUser);
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
		// const env = this.configService.get<boolean>('database.synchronize');
		// console.log('DATABASE_USERNAME from ConfigService:', typeof env);
		console.log(this.profileConfiguration.apiKey);

		return [
			{
				firstName: "John",
				email: "john@doe.com",
			},
			{
				firstName: "Alice",
				email: "alice@doe.com",
			},
		]
	}

	/**
	 * Find one user by ID
	 * @param id 
	 * @returns 
	 */
	public async findOneById(id: string) {
		return await this.usersRepository.findOneBy({ id });
	}
}