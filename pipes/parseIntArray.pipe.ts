import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntArrayPipe implements PipeTransform {
  transform(value: any): number[] {
    if (!Array.isArray(value)) {
      throw new BadRequestException('Validation failed: supplierIds must be an array');
    }

    return value.map((item) => {
      const val = parseInt(item, 10);
      if (isNaN(val)) {
        throw new BadRequestException(`Validation failed: ${item} is not a number`);
      }
      return val;
    });
  }
}