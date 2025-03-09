import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chapter } from '../schemas/chapter.schema';
import { CreateChapterDto, UpdateChapterDto } from '../dto/chapter.dto';

@Controller('chapters')
export class ChapterController {
  constructor(
    @InjectModel(Chapter.name) private chapterModel: Model<Chapter>
  ) {}

  @Post()
  async create(@Body() createChapterDto: CreateChapterDto): Promise<Chapter> {
    const createdChapter = new this.chapterModel(createChapterDto);
    return createdChapter.save();
  }

  @Get()
  async findAll(): Promise<Chapter[]> {
    return this.chapterModel.find().populate('headings').exec();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Chapter> {
    const chapter = await this.chapterModel.findById(id).populate('headings').exec();
    if (!chapter) {
      throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
    }
    return chapter;
  }

  @Put(':id')
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
  async remove(@Param('id') id: string): Promise<void> {
    const result = await this.chapterModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Chapter not found', HttpStatus.NOT_FOUND);
    }
  }
} 