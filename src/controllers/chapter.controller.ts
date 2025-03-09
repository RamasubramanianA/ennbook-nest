import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Chapter } from '../schemas/chapter.schema';
import { CreateChapterDto, UpdateChapterDto } from '../dto/chapter.dto';

@ApiTags('Chapters')
@Controller('chapters')
export class ChapterController {
  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new chapter' })
  @ApiResponse({ status: 201, description: 'Chapter created successfully', type: Chapter })
  async create(@Body() createChapterDto: CreateChapterDto): Promise<Chapter> {
    const createdChapter = new this.chapterModel(createChapterDto);
    return createdChapter.save();
  }

  @Get()
  @ApiOperation({ summary: 'Get all chapters' })
  @ApiResponse({ status: 200, description: 'List of all chapters', type: [Chapter] })
  async findAll(): Promise<Chapter[]> {
    return this.chapterModel.find().populate('headings').exec();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a chapter by id' })
  @ApiResponse({ status: 200, description: 'The found chapter', type: Chapter })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  async findOne(@Param('id') id: string): Promise<Chapter> {
    const chapter = await this.chapterModel.findById(id).populate('headings').exec();
    if (!chapter) {
      throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
    }
    return chapter;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a chapter' })
  @ApiResponse({ status: 200, description: 'Chapter updated successfully', type: Chapter })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  async update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto): Promise<Chapter> {
    const chapter = await this.chapterModel.findByIdAndUpdate(
      id,
      { ...updateChapterDto, modifiedOn: new Date() },
      { new: true }
    ).exec();
    
    if (!chapter) {
      throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
    }
    return chapter;
  }

  @Put(':id/add-heading/:headingId')
  @ApiOperation({ summary: 'Add a heading to a chapter' })
  @ApiResponse({ status: 200, description: 'Heading added successfully', type: Chapter })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  async addHeading(
    @Param('id') id: string,
    @Param('headingId') headingId: string,
  ): Promise<Chapter> {
    const chapter = await this.chapterModel.findById(id);
    if (!chapter) {
      throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
    }

    const headingObjectId = new Types.ObjectId(headingId);
    if (!chapter.headings.map(h => h.toString()).includes(headingObjectId.toString())) {
      chapter.headings.push(headingObjectId);
      await chapter.save();
    }

    return chapter.populate('headings');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a chapter' })
  @ApiResponse({ status: 200, description: 'Chapter deleted successfully' })
  @ApiResponse({ status: 404, description: 'Chapter not found' })
  async remove(@Param('id') id: string): Promise<void> {
    const result = await this.chapterModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
    }
  }
} 