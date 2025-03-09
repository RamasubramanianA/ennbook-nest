import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChapterDto {
  @ApiProperty({ description: 'Name of the chapter' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Chapter description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Chapter objective' })
  @IsString()
  @IsOptional()
  objective?: string;

  @ApiPropertyOptional({ description: 'Chapter summary points', type: [String] })
  @IsArray()
  @IsOptional()
  summary?: string[];

  @ApiProperty({ description: 'User who created the chapter' })
  @IsString()
  createdBy: string;
}

export class UpdateChapterDto {
  @ApiPropertyOptional({ description: 'Name of the chapter' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Chapter description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Chapter objective' })
  @IsString()
  @IsOptional()
  objective?: string;

  @ApiPropertyOptional({ description: 'Chapter summary points', type: [String] })
  @IsArray()
  @IsOptional()
  summary?: string[];

  @ApiPropertyOptional({ description: 'Array of heading IDs', type: [String] })
  @IsArray()
  @IsOptional()
  headings?: string[];

  @ApiProperty({ description: 'User who modified the chapter' })
  @IsString()
  modifiedBy: string;
} 