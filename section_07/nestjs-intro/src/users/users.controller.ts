import {
	Controller,
	Get,
	Post,
	Patch,
	Put,
	Delete,
	Param,
	Query,
	Body,
	Headers,
	Ip,
	ParseIntPipe,
	DefaultValuePipe,
	ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
	) { }

	@Get('{/:id}')
	@ApiOperation({
		summary: 'Get user by ID'
	})
	@ApiResponse({
		status: 200,
		description: 'The user has been successfully retrieved.',
	})
	@ApiQuery({
		name: 'limit',
		type: 'number',
		required: false,
		description: 'Limit the number of users returned',
		example: 10
	})
	@ApiQuery({
		name: 'page',
		type: 'number',
		required: false,
		description: 'Page number for pagination',
		example: 1
	})
	public getUsers(
		@Param() getUsersParamDto: GetUsersParamDto,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
	) {
		return this.usersService.findAll(getUsersParamDto, limit, page);
	}

	@Post()
	public createUsers(
		@Body() createUserDto: CreateUserDto,
	) {
		return this.usersService.createUser(createUserDto);
	}

	@Patch()
	public patchUser(
		@Body() patchUserDto: PatchUserDto
	) {
		return patchUserDto;
	}
}
