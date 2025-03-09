import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ description: 'Name of the book' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Book description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Book objective' })
  @IsString()
  @IsOptional()
  objective?: string;

  @ApiProperty({ description: 'User who created the book' })
  @IsString()
  createdBy: string;
}

export class UpdateBookDto {
  @ApiPropertyOptional({ description: 'Name of the book' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Book description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Book objective' })
  @IsString()
  @IsOptional()
  objective?: string;

  @ApiProperty({ description: 'User who modified the book' })
  @IsString()
  modifiedBy: string;

  @ApiPropertyOptional({ description: 'Array of chapter IDs', type: [String] })
  @IsArray()
  @IsOptional()
  chapters?: string[];
} 