import { ProductDetails } from '../types/products';

export default function(products: Array<Partial<ProductDetails>>) {
  return `
    insert into stocks(product_id, count)
    values ${
      products
        .map(product => `(
          '${product.id}', 
          ${product.count}
        )`)
        .join(',')
    }
    returning *;
  `;
}
