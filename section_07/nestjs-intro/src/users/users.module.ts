import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	controllers: [UsersController],
	providers: [UsersService],
	imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
	exports: [UsersService],
})
export class UsersModule { }