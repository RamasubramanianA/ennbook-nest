import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book } from '../schemas/book.schema';
import { CreateBookDto, UpdateBookDto } from '../dto/book.dto';

@Controller('books')
export class BookController {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<Book>
  ) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  @Get()
  async findAll(): Promise<Book[]> {
    return this.bookModel.find().populate('chapters').exec();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).populate('chapters').exec();
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
    return book;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookModel.findByIdAndUpdate(
      id,
      { ...updateBookDto, modifiedOn: new Date() },
      { new: true }
    ).exec();
    
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
    return book;
  }

  @Put(':id/add-chapter/:chapterId')
  async addChapter(
    @Param('id') id: string,
    @Param('chapterId') chapterId: string,
  ): Promise<Book> {
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }

    const chapterObjectId = new Types.ObjectId(chapterId);
    if (!book.chapters.map(c => c.toString()).includes(chapterObjectId.toString())) {
      book.chapters.push(chapterObjectId);
      await book.save();
    }

    return book.populate('chapters');
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    const result = await this.bookModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
  }
} 