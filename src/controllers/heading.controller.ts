import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Heading } from '../schemas/heading.schema';
import { CreateHeadingDto, UpdateHeadingDto } from '../dto/heading.dto';

@Controller('headings')
export class HeadingController {
  constructor(
    @InjectModel(Heading.name) private headingModel: Model<Heading>
  ) {}

  @Post()
  async create(@Body() createHeadingDto: CreateHeadingDto): Promise<Heading> {
    const createdHeading = new this.headingModel(createHeadingDto);
    return createdHeading.save();
  }

  @Get()
  async findAll(): Promise<Heading[]> {
    return this.headingModel.find().populate(['subHeadings', 'article']).exec();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Heading> {
    const heading = await this.headingModel.findById(id).populate(['subHeadings', 'article']).exec();
    if (!heading) {
      throw new HttpException('Heading not found', HttpStatus.NOT_FOUND);
    }
    return heading;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateHeadingDto: UpdateHeadingDto): Promise<Heading> {
    const heading = await this.headingModel.findByIdAndUpdate(
      id,
      { ...updateHeadingDto, modifiedOn: new Date() },
      { new: true }
    ).exec();
    
    if (!heading) {
      throw new HttpException('Heading not found', HttpStatus.NOT_FOUND);
    }
    return heading;
  }

  @Put(':id/add-subheading/:subHeadingId')
  async addSubHeading(
    @Param('id') id: string,
    @Param('subHeadingId') subHeadingId: string,
  ): Promise<Heading> {
    const heading = await this.headingModel.findById(id);
    if (!heading) {
      throw new HttpException('Heading not found', HttpStatus.NOT_FOUND);
    }

    if (!heading.subHeadings.some(h => h._id.toString() === subHeadingId)) {
      heading.subHeadings.push(subHeadingId as any);
      await heading.save();
    }

    return heading.populate(['subHeadings', 'article']);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const result = await this.headingModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Heading not found', HttpStatus.NOT_FOUND);
    }
  }
} 