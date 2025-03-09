import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHeadingDto {
  @ApiProperty({ description: 'Name of the heading' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Heading description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Heading objective' })
  @IsString()
  @IsOptional()
  objective?: string;

  @ApiPropertyOptional({ description: 'Associated article ID' })
  @IsString()
  @IsOptional()
  articleId?: string;

  @ApiProperty({ description: 'User who created the heading' })
  @IsString()
  createdBy: string;
}

export class UpdateHeadingDto {
  @ApiPropertyOptional({ description: 'Name of the heading' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Heading description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Heading objective' })
  @IsString()
  @IsOptional()
  objective?: string;

  @ApiPropertyOptional({ description: 'Associated article ID' })
  @IsString()
  @IsOptional()
  articleId?: string;

  @ApiPropertyOptional({ description: 'Array of subheading IDs', type: [String] })
  @IsArray()
  @IsOptional()
  subHeadings?: string[];

  @ApiProperty({ description: 'User who modified the heading' })
  @IsString()
  modifiedBy: string;
} 