import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { CreateUserProvider } from './create-user.provider';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

describe('UsersService', () => {
	const mockCreateUserProvider: Partial<CreateUserProvider> = {
		createUser: (createUserDto: CreateUserDto) => Promise.resolve({
			id: "dummy",
			email: createUserDto.email,
			firstName: createUserDto.firstName,
			lastName: createUserDto.lastName ?? "",
			password: createUserDto.password,
		}),
	};

	let service: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{ provide: CreateUserProvider, useValue: mockCreateUserProvider },
				{ provide: DataSource, useValue: {} },
				{ provide: getRepositoryToken(User), useValue: {} },
				{ provide: CreateGoogleUserProvider, useValue: {} },
				{ provide: FindOneByGoogleIdProvider, useValue: {} },
				{ provide: FindOneUserByEmailProvider, useValue: {} },
				{ provide: UsersCreateManyProvider, useValue: {} },
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe("createUser", () => {
		it("Should be defined", () => {
			expect(service.createUser).toBeDefined();
		});
		it("Should call createUser on CreateUserProvider", async () => {
			let user = await service.createUser({
				firstName: "John",
				lastName: "Doe",
				email: "john@doe.com",
				password: "password",
			});
			expect(user.firstName).toEqual("John");
		})
	})
});
