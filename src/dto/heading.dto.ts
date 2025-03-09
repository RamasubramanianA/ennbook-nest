import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateHeadingDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  objective?: string;

  @IsString()
  @IsOptional()
  articleId?: string;

  @IsString()
  createdBy: string;
}

export class UpdateHeadingDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  objective?: string;

  @IsString()
  @IsOptional()
  articleId?: string;

  @IsArray()
  @IsOptional()
  subHeadings?: string[];

  @IsString()
  modifiedBy: string;
} 