import { BaseProduct } from '../types/products';

import {
  IsNotEmpty,
  IsInt,
  validateOrReject,
} from 'class-validator';
import { ValidationError } from '@libs/validation-error';

class ProductCreationRequestValidator implements BaseProduct {
  @IsNotEmpty()
  title: string;

  @IsInt()
  price: number;

  @IsInt()
  count: number;

  constructor({ title, price, count }: BaseProduct) {
    this.title = title;
    this.price = price;
    this.count = count;
  }
}

export default function(product: BaseProduct) {
  const validationProduct = new ProductCreationRequestValidator(product);

  return validateOrReject(validationProduct).catch(errors => {
    throw new ValidationError(errors.toString())
  });
}
