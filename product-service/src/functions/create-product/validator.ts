import { BaseProduct } from '../../types/products';

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
}

export default function(product: BaseProduct) {
  const validationProduct = new ProductCreationRequestValidator();

  validationProduct.title = product.title;
  validationProduct.price = product.price;

  return validateOrReject(validationProduct).catch(errors => {
    throw new ValidationError(errors.toString())
  });
}
