import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateBookDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  objective?: string;

  @IsString()
  createdBy: string;
}

export class UpdateBookDto {
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
  modifiedBy: string;

  @IsArray()
  @IsOptional()
  chapters?: string[];
} 