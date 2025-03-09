import { IsString, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TabType } from '../enums/article.enum';

class ContentDto {
  @ApiProperty({ description: 'Text content of the article' })
  @IsString()
  text: string;
}

export class CreateArticleDto {
  @ApiProperty({ description: 'Article content' })
  @ValidateNested()
  @Type(() => ContentDto)
  contents: ContentDto;

  @ApiProperty({ description: 'Article tab type', enum: TabType, enumName: 'TabType' })
  @IsEnum(TabType)
  tab: TabType;
}

export class UpdateArticleDto {
  @ApiPropertyOptional({ description: 'Article content' })
  @ValidateNested()
  @Type(() => ContentDto)
  contents?: ContentDto;

  @ApiPropertyOptional({ description: 'Article tab type', enum: TabType, enumName: 'TabType' })
  @IsEnum(TabType)
  tab?: TabType;
} 