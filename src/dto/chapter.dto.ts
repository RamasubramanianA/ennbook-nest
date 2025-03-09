import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateChapterDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  objective?: string;

  @IsArray()
  @IsOptional()
  summary?: string[];

  @IsString()
  createdBy: string;
}

export class UpdateChapterDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  objective?: string;

  @IsArray()
  @IsOptional()
  summary?: string[];

  @IsArray()
  @IsOptional()
  headings?: string[];

  @IsString()
  modifiedBy: string;
} 