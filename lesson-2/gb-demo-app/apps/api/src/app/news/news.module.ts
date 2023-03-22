import { CacheModule, Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [PrismaModule, UsersModule, CacheModule.register()],
  exports: [NewsService],
})
export class NewsModule {}