import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GetUsersParamDto } from "../dtos/get-users-param.dto";
import { AuthService } from "src/auth/providers/auth.service";

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
		private readonly authService: AuthService
	) { }

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
	public findOneById(id: string) {
		return {
			id,
			firstName: "John",
			email: "john@doe.com",
		}
	}
}