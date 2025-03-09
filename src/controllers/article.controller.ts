import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Article } from '../schemas/article.schema';
import { CreateArticleDto, UpdateArticleDto } from '../dto/article.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({ status: 201, description: 'Article created successfully', type: Article })
  async create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    const createdArticle = new this.articleModel(createArticleDto);
    return createdArticle.save();
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'List of all articles', type: [Article] })
  async findAll(): Promise<Article[]> {
    return this.articleModel.find().exec();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an article by id' })
  @ApiResponse({ status: 200, description: 'The found article', type: Article })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async findOne(@Param('id') id: string): Promise<Article> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    return article;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an article' })
  @ApiResponse({ status: 200, description: 'Article updated successfully', type: Article })
  @ApiResponse({ status: 404, description: 'Article not found' })
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
  @ApiOperation({ summary: 'Delete an article' })
  @ApiResponse({ status: 200, description: 'Article deleted successfully' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  async remove(@Param('id') id: string): Promise<void> {
    const result = await this.articleModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
  }
} 