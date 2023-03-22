import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { UsersModule } from '../users/users.module';
import { NewsModule } from '../news/news.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [UsersModule, forwardRef(() => NewsModule), PrismaModule],
  exports: [CommentsService],
})
export class CommentsModule {}