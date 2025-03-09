import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { TabType } from '../enums/article.enum';

export class CreateArticleDto {
  @IsNotEmpty()
  contents: {
    text: string;
  };

  @IsEnum(TabType)
  tab: TabType;
}

export class UpdateArticleDto {
  contents?: {
    text: string;
  };

  @IsEnum(TabType)
  tab?: TabType;
} 