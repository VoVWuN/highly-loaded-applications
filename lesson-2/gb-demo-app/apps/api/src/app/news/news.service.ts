import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';

import { UsersService } from '../users/users.service';

import { PrismaService } from '../prisma/prisma.service';
import { News } from '@prisma/client';
import { Cache } from 'cache-manager';

@Injectable()
export class NewsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createNews(dto: CreateNewsDto): Promise<News> {
    const _user = await this.usersService.findOne(+dto.userId);
    return this.prismaService.news.create({
      data: {
        title: dto.title,
        description: dto.description,
        cover: dto.cover,
        userId: _user.id,
      },
    });
  }

  async findById(id: number): Promise<News> {
    return this.prismaService.news.findUniqueOrThrow({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async getAll(userId): Promise<News[]> {
    let value = await this.cacheManager.get<News[]>('news');

    if (value) {
      return value;
    }

    if (userId === 0) {
      let news = await this.prismaService.news.findMany({
        include: {
          user: true,
        },
      });

      await this.cacheManager.set('news', news);

      return news;
    } else {
      let news = await this.prismaService.news.findMany({
        where: {
          user: {
            id: userId,
          },
        },
        include: {
          user: true,
        },
      });

      await this.cacheManager.set('news', news);
      return news;
    }
  }

  async remove(id: News['id']): Promise<News | string> {
    return this.prismaService.news.delete({
      where: { id },
    });
  }
}