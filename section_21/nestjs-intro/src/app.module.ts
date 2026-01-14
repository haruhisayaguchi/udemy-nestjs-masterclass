import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    MongooseModule.forRoot(
      'mongodb+srv://nestjs-intro:4NJ3fJrtbZYc1Y9V4RsX6cLEsGSwWlGq@nestjs-intro.wwqbzji.mongodb.net/?appName=nestjs-intro',
      { dbName: 'nestjs-intro' },
    ),
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
