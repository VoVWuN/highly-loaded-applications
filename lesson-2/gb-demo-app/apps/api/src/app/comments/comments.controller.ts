import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
  } from '@nestjs/common';
  import { CommentsService } from './comments.service';
  import { CreateCommentDto } from './dto/create-comment.dto';
  import { UpdateCommentDto } from './dto/update-comment.dto';
  
  @Controller('comments')
  export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}
  
    @Post('/:idNews')
    create(
      @Param('idNews', ParseIntPipe) idNews: number,
      @Body() comment: CreateCommentDto,
      @Req() req,
    ) {
      // const jwtUserId = req.user.userId;
      return this.commentsService.create(idNews, comment);
    }
  
    @Get()
    findAll() {
      return this.commentsService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.commentsService.findOne(+id);
    }
  
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateCommentDto: UpdateCommentDto,
    ) {
      return this.commentsService.updateComment(id, updateCommentDto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.commentsService.remove(id);
    }
  }