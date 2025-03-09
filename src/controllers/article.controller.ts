import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from '../schemas/article.schema';
import { CreateArticleDto, UpdateArticleDto } from '../dto/article.dto';

@Controller('articles')
export class ArticleController {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>
  ) {}

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    const createdArticle = new this.articleModel(createArticleDto);
    return createdArticle.save();
  }

  @Get()
  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    return article;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.articleModel.findByIdAndUpdate(
      id,
      updateArticleDto,
      { new: true }
    ).exec();
    
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    return article;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const result = await this.articleModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
  }
} 