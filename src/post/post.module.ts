import { Module } from '@nestjs/common';
import { PostService } from './post.service.js';
import { PostController } from './post.controller.js';

@Module({
  providers: [PostService],
  controllers: [PostController]
})
export class PostModule {}
