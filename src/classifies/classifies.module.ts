import { Module } from '@nestjs/common';
import { ClassifiesService } from './classifies.service';
import { ClassifiesController } from './classifies.controller';

@Module({
  controllers: [ClassifiesController],
  providers: [ClassifiesService],
})
export class ClassifiesModule {}
