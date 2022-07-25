import { BaseProduct } from '../types/products';

export default function(product: BaseProduct) {
  return `
    insert into products(title, description, price, imageUrl)
    values (
      '${product.title}', 
      ${product.description ? `'${product.description}'` : null},
      ${product.price},
      ${product.imageUrl ? `'${product.imageUrl}'` : null}
    )
    returning *;
  `;
}
