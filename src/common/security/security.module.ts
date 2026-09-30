import { Module } from '@nestjs/common';
import { EncService } from './encryption.service.js';
import { HashService } from './hash.service.js';

@Module({
  providers: [EncService, HashService],
  exports: [EncService, HashService]
})
export class SecurityModule {}
