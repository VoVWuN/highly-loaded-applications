import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../utils/helperFileLoader';
import { imageFileFilter } from '../utils/imageFileFilter';
import { CreateNewsDto } from './dto/create-news.dto';
import { News } from '@prisma/client';

const PATH_NEWS = '';
const helperFileLoaderNews = new HelperFileLoader();
helperFileLoaderNews.path = PATH_NEWS;

@Controller('news')
@UseInterceptors(CacheInterceptor)
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Get('/all')
  async getAll(userId): Promise<News[]> {
    return this.newsService.getAll(userId);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('cover', 1, {
      storage: diskStorage({
        destination: helperFileLoaderNews.destinationPath,
        filename: helperFileLoaderNews.customFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async createNews(
    @Body() dto: CreateNewsDto,
    @UploadedFiles() cover: Express.Multer.File,
  ) {
    if (cover[0]?.filename) {
      dto.cover = PATH_NEWS + cover[0].filename;
    }
    const _news = await this.newsService.createNews(dto);
    // await this.mailService.sendNewNewsForAdmins(
    //   ['sizov.ilya1996@gmail.com'],
    //   _news,
    // );

    return _news;
  }

  @Get('/:idNews')
  async getOneNews(
    @Param('idNews', ParseIntPipe) idNews: number,
  ): Promise<News> {
    const news = await this.newsService.findById(idNews);

    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      ...news,
    };
  }

  @Delete('/:idNews')
  async deleteOneNews(@Param('idNews', ParseIntPipe) idNews: number) {
    return this.newsService.remove(idNews);
  }
}

// async getNews() {
//   return new Promise(resolve => {
//     const news = Object.keys([...Array(20)])
//       .map(key => Number(key) + 1)
//       .map(n => ({
//         id: n,
//         title: `Важная новость ${n}`,
//         description: (rand =>
//           [...Array(rand(1000))]
//             .map(() =>
//               rand(10 ** 16)
//                 .toString(36)
//                 .substring(rand(10)),
//             )
//             .join(' '))(max => Math.ceil(Math.random() * max)),
//         createdAt: Date.now(),
//       }));
//
//     setTimeout(() => {
//       resolve(news);
//     }, 100);
//   });
// }