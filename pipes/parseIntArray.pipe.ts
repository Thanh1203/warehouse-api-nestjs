import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntArrayPipe implements PipeTransform {
  constructor(private readonly key: string = 'value') {}

  transform(value: any): number[] {
    if (!Array.isArray(value)) {
      throw new BadRequestException(`Validation failed: ${this.key} must be an array`);
    }

    return value.map((item, index) => {
      const val = parseInt(item, 10);
      if (isNaN(val)) {
        throw new BadRequestException(`Validation failed: Item at index ${index} (${item}) in ${this.key} is not a valid number`);
      }
      return val;
    });
  }
}