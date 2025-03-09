import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Heading } from '../schemas/heading.schema';
import { CreateHeadingDto, UpdateHeadingDto } from '../dto/heading.dto';

@ApiTags('Headings')
@Controller('headings')
export class HeadingController {
  constructor(
    @InjectModel(Heading.name) private headingModel: Model<Heading>
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new heading' })
  @ApiResponse({ status: 201, description: 'Heading created successfully', type: Heading })
  async create(@Body() createHeadingDto: CreateHeadingDto): Promise<Heading> {
    const createdHeading = new this.headingModel(createHeadingDto);
    return createdHeading.save();
  }

  @Get()
  @ApiOperation({ summary: 'Get all headings' })
  @ApiResponse({ status: 200, description: 'List of all headings', type: [Heading] })
  async findAll(): Promise<Heading[]> {
    return this.headingModel.find().populate(['subHeadings', 'article']).exec();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a heading by id' })
  @ApiResponse({ status: 200, description: 'The found heading', type: Heading })
  @ApiResponse({ status: 404, description: 'Heading not found' })
  async findOne(@Param('id') id: string): Promise<Heading> {
    const heading = await this.headingModel.findById(id).populate(['subHeadings', 'article']).exec();
    if (!heading) {
      throw new HttpException('Heading not found', HttpStatus.NOT_FOUND);
    }
    return heading;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a heading' })
  @ApiResponse({ status: 200, description: 'Heading updated successfully', type: Heading })
  @ApiResponse({ status: 404, description: 'Heading not found' })
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
  @ApiOperation({ summary: 'Add a subheading to a heading' })
  @ApiResponse({ status: 200, description: 'Subheading added successfully', type: Heading })
  @ApiResponse({ status: 404, description: 'Heading not found' })
  async addSubHeading(
    @Param('id') id: string,
    @Param('subHeadingId') subHeadingId: string,
  ): Promise<Heading> {
    const heading = await this.headingModel.findById(id);
    if (!heading) {
      throw new HttpException('Heading not found', HttpStatus.NOT_FOUND);
    }

    const subHeadingObjectId = new Types.ObjectId(subHeadingId);
    if (!heading.subHeadings.map(h => h.toString()).includes(subHeadingObjectId.toString())) {
      heading.subHeadings.push(subHeadingObjectId);
      await heading.save();
    }

    return heading.populate(['subHeadings', 'article']);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a heading' })
  @ApiResponse({ status: 200, description: 'Heading deleted successfully' })
  @ApiResponse({ status: 404, description: 'Heading not found' })
  async remove(@Param('id') id: string): Promise<void> {
    const result = await this.headingModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Heading not found', HttpStatus.NOT_FOUND);
    }
  }
} 