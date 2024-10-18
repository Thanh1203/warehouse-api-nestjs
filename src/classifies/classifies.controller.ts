import { Controller } from '@nestjs/common';
import { ClassifiesService } from './classifies.service';

@Controller('classifies')
export class ClassifiesController {
  constructor(private readonly classifiesService: ClassifiesService) {}
}
