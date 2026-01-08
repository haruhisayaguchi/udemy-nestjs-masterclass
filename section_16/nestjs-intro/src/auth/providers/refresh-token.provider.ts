import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { type ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { ActiveUser } from '../interfaces/active-user.interface';

@Injectable()
export class RefreshTokenProvider {
	constructor(
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
		private readonly jwtService: JwtService,
		private readonly generateTokensProvider: GenerateTokensProvider,
	) { }

	public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
		try {
			// verify the refresh token using jwtService
			const { sub } = await this.jwtService.verifyAsync<Pick<ActiveUser, 'sub'>>(refreshTokenDto.refreshToken, {
				secret: this.jwtConfiguration.secret,
				audience: this.jwtConfiguration.audience,
				issuer: this.jwtConfiguration.issuer,
			})
			// Fetch the user from the database
			const user = await this.usersService.findOneById(sub);
			// Generate the tokens
			return await this.generateTokensProvider.generateTokens(user);
		} catch (error) {
			throw new UnauthorizedException(error);
		}
	}
}
