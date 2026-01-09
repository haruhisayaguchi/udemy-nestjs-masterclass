import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserProvider } from './create-user.provider';
import { MailService } from 'src/mail/providers/mail.service';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { BadRequestException } from '@nestjs/common';

type MockRepository<T extends ObjectLiteral> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T extends ObjectLiteral>(): MockRepository<T> => ({
	findOne: jest.fn(),
	create: jest.fn(),
	save: jest.fn(),
});

describe('CreateUserProvider', () => {
	let provider: CreateUserProvider;
	let usersRepository: MockRepository<User>;
	const user = {
		firstName: "John",
		lastName: "Doe",
		email: "john@doe.com",
		password: "password",
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateUserProvider,
				{ provide: DataSource, useValue: {} },
				{ provide: getRepositoryToken(User), useValue: createMockRepository<User>() },
				{
					provide: HashingProvider, useValue: {
						hashPassword: jest.fn(() => user.password),
					}
				},
				{
					provide: MailService, useValue: {
						sendUserWelcome: jest.fn(() => Promise.resolve()),
					}
				},
			],
		}).compile();

		provider = module.get<CreateUserProvider>(CreateUserProvider);
		usersRepository = module.get(getRepositoryToken(User));
	});

	it('should be defined', () => {
		expect(CreateUserProvider).toBeDefined();
	});

	describe("createUser", () => {
		describe("When the user does not exist in database", () => {
			it("Should create a new user", async () => {
				usersRepository.findOne?.mockReturnValue(null);
				usersRepository.create?.mockReturnValue(user);
				usersRepository.save?.mockReturnValue(user);
				const newUser = await provider.createUser(user);
				expect(usersRepository.findOne).toHaveBeenCalledWith({
					where: { email: user.email }
				})
				expect(usersRepository.create).toHaveBeenCalledWith(user);
				expect(usersRepository.save).toHaveBeenCalledWith(user);
				expect(newUser.firstName).toEqual("John");
			})
		})
		describe("When the user exists", () => {
			it("Throw BadRequestException", async () => {
				usersRepository.findOne?.mockReturnValue(user);
				usersRepository.create?.mockReturnValue(user);
				usersRepository.save?.mockReturnValue(user);
				try {
					const newUser = await provider.createUser(user);
				} catch (error) {
					expect(error).toBeInstanceOf(BadRequestException);
				}
			})
		})
	})
});
