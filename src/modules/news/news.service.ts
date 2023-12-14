import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { InjectModel } from '@nestjs/mongoose';
import { News } from './news.schema';
import { Model } from 'mongoose';
import { AppResponse } from '~/common/interfaces';
import { Observable } from 'rxjs';
import { PaginationResponse, escapeRegex } from '~/helpers';
import { findPaginateNews } from './dto/find-paginate-news.dto';
import PaginationHelper from '~/helpers/pagination.helper';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<News>,) {}
  async create(createServiceDto: CreateNewsDto): Promise<AppResponse<News> | Observable<never>> {
    return {
      content: await this.newsModel.create({
        ...createServiceDto,
      }),
    };
  }

  async findPaginateNews(dto: findPaginateNews): Promise<AppResponse<PaginationResponse<News>>> {
    const { page, perPage, match, skip } = PaginationHelper.getQueryByPagination<News, findPaginateNews>(dto);

    const { keyword } = dto;

    if (keyword) {
      match.name = { $regex: new RegExp(escapeRegex(keyword), 'i') };
    }

    const [videos, count] = await Promise.all([
      this.newsModel.find(match).sort({ createdAt: 'desc' }).limit(perPage).skip(skip),
      this.newsModel.countDocuments(match),
    ]);
    return {
      content: PaginationHelper.getPaginationResponse({ page: page, data: videos, perPage: perPage, total: count }),
    };
  }
  async findOne(id: string) {
    const News = await this.findByField({ _id: id });

    if (News instanceof Observable) {
      return News;
    }

    return {
      content: News,
    };
  }
  async findByField(filter: object): Promise<News | Observable<never>> {
    const News = await this.newsModel.findOne(filter);

    if (!News) {
      throw new BadRequestException('News not exist');
    }

    return News;
  }
  async update(id: string, updateNewsDto: UpdateNewsDto) {
    // const { name } = updateNewsDto;
    const News = await this.findByField({ _id: id });

    if (News instanceof Observable) {
      return News;
    }
    const data: any = {
      ...UpdateNewsDto,
      name: name,
    };

    return {
      content: await this.newsModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: data,
        },
        { new: true },
      ),
    };
  }
  async remove(id: string) {
    const News = await this.newsModel.findOne({
      _id: id,
    });

    if (!News) {
      throw new BadRequestException('News not found');
    }

    return {
      content: await this.newsModel.findByIdAndRemove({ _id: id }),
    };
  }
}
