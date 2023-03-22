import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { NewsService } from '../news/news.service';
import { UsersService } from '../users/users.service';
import { Comments } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly newsService: NewsService,
    private readonly usersService: UsersService,
  ) {}
  async create(idNews: number, comment: CreateCommentDto) {
    const _news = await this.newsService.findById(idNews);

    if (!_news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const _user = await this.usersService.findOne(comment.userId);

    if (!_user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Пользователь не найден',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const createdComment = {} as Comments;
    createdComment.message = comment.message;
    createdComment.userId = _user.id;
    createdComment.newsId = _news.id;

    if (!comment.commentId) {
      return this.prismaService.comments.create({
        data: createdComment,
      });
    }

    createdComment.parentId = comment.commentId;
    return this.prismaService.comments.create({
      data: createdComment,
    });
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async updateComment(
    id: number,
    commentsEdit: UpdateCommentDto,
  ): Promise<Comments> {
    return this.prismaService.comments.update({
      where: { id },
      data: commentsEdit,
      include: {
        news: true,
        user: true,
      },
    });
  }

  remove(id: number) {
    return this.prismaService.comments.delete({ where: { id } });
  }
}