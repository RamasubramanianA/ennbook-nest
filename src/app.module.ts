import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Book, BookSchema } from './schemas/book.schema';
import { Chapter, ChapterSchema } from './schemas/chapter.schema';
import { Heading, HeadingSchema } from './schemas/heading.schema';
import { Article, ArticleSchema } from './schemas/article.schema';
import { BookController } from './controllers/book.controller';
import { ChapterController } from './controllers/chapter.controller';
import { HeadingController } from './controllers/heading.controller';
import { ArticleController } from './controllers/article.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Chapter.name, schema: ChapterSchema },
      { name: Heading.name, schema: HeadingSchema },
      { name: Article.name, schema: ArticleSchema },
    ]),
  ],
  controllers: [
    AppController,
    BookController,
    ChapterController,
    HeadingController,
    ArticleController,
  ],
  providers: [AppService],
})
export class AppModule {}
