import { forwardRef, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';
import { CreateGoogleUserProvider } from 'src/users/providers/create-google-user.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
	constructor(
		@Inject(forwardRef(() => UsersService))
		private readonly usersService: UsersService,
		@Inject(jwtConfig.KEY)
		private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
		private readonly generateTokensProvider: GenerateTokensProvider,
	) { }

	private oauthClient: OAuth2Client;

	onModuleInit() {
		const clientId = this.jwtConfiguration.googleClientId;
		const clientSecret = this.jwtConfiguration.googleClientSecret;
		this.oauthClient = new OAuth2Client(clientId, clientSecret);
	}

	public async authenticate(googleTokenDto: GoogleTokenDto) {
		try {
			// Verify the Google Token sent by User
			const loginTicket = await this.oauthClient.verifyIdToken({
				idToken: googleTokenDto.token,
			})
			// Extract the payload from Google JWT
			const {
				email,
				sub: googleId,
				given_name: firstName,
				family_name: lastName,
			} = loginTicket.getPayload() ?? {};
			if (email && googleId && firstName && lastName) {
				// Find the user in the database using the GoogleId
				const user = await this.usersService.findOneByGoogleId(googleId);
				// If googleID exists generate token
				if (user) return this.generateTokensProvider.generateTokens(user);
				// If not create a new user and then generate tokens
				const newUser = await this.usersService.createGoogleUser({
					email,
					firstName,
					lastName,
					googleId,
				})
				return this.generateTokensProvider.generateTokens(newUser);
			}
			throw new UnauthorizedException('Failed to extract payload');
		} catch (error) {
			// If failed throw Unauthorised exception
			throw new UnauthorizedException(error);
		}
	}

}
