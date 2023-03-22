import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
    UseInterceptors,
    UploadedFiles,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { ApiTags } from '@nestjs/swagger';
  import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { HelperFileLoader } from '../utils/helperFileLoader';
  import { imageFileFilter } from '../utils/imageFileFilter';
  
  const PATH_COMMENTS = '';
  const helperFileLoaderComment = new HelperFileLoader();
  helperFileLoaderComment.path = PATH_COMMENTS;
  
  @Controller('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post()
    @UseInterceptors(
      FilesInterceptor('avatar', 1, {
        storage: diskStorage({
          destination: helperFileLoaderComment.destinationPath,
          filename: helperFileLoaderComment.customFileName,
        }),
        fileFilter: imageFileFilter,
      }),
    )
    async create(
      @Body() createUserDto: CreateUserDto,
      @UploadedFiles() avatar: Express.Multer.File,
    ) {
      if (avatar[0]?.filename) {
        createUserDto.avatar = PATH_COMMENTS + avatar[0].filename;
      }
  
      return this.usersService.create(createUserDto);
    }
  
    @Get()
    async findAll() {
      return this.usersService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
      return this.usersService.findOne(id);
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
      return this.usersService.update(+id, updateUserDto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string) {
      return this.usersService.remove(+id);
    }
  }