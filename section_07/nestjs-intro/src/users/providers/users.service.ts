import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GetUsersParamDto } from "../dtos/get-users-param.dto";
import { AuthService } from "src/auth/providers/auth.service";
import { Repository } from "typeorm";
import { User } from "../user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dtos/create-user.dto";

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
		private readonly usersRepository: Repository<User>
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
		const isAuth = this.authService.isAuth();
		console.log(isAuth);

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