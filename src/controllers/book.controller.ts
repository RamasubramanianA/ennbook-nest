import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Book } from '../schemas/book.schema';
import { CreateBookDto, UpdateBookDto } from '../dto/book.dto';

@ApiTags('Books')
@Controller('books')
export class BookController {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<Book>
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book created successfully', type: Book })
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'List of all books', type: [Book] })
  async findAll(): Promise<Book[]> {
    return this.bookModel.find().populate('chapters').exec();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by id' })
  @ApiResponse({ status: 200, description: 'The found book', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findOne(@Param('id') id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).populate('chapters').exec();
    if (!book) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
    return book;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiResponse({ status: 200, description: 'Book updated successfully', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found' })
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
  @ApiOperation({ summary: 'Add a chapter to a book' })
  @ApiResponse({ status: 200, description: 'Chapter added successfully', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found' })
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
  @ApiOperation({ summary: 'Delete a book' })
  @ApiResponse({ status: 200, description: 'Book deleted successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async remove(@Param('id') id: string): Promise<void> {
    const result = await this.bookModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
    }
  }
} 