import { ProductDetails } from '../types/products';

export default function(product: ProductDetails) {
  return `
    insert into stocks(product_id, count)
    values (
      '${product.id}', 
      ${product.count}
    )
    returning *;
  `;
}
