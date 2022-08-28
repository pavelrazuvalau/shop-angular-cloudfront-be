import { BaseProduct } from '../types/products';

export default function(product: BaseProduct) {
  return `
    insert into products(title, description, price, image_url)
    values (
      '${product.title}', 
      ${product.description ? `'${product.description}'` : null},
      ${product.price},
      ${product.imageUrl ? `'${product.imageUrl}'` : null}
    )
    returning id, title, description, price, image_url as imageUrl;
  `;
}
