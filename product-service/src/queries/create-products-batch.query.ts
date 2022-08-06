import { BaseProduct } from '../types/products';

export default function(products: BaseProduct[]) {
  return `
    insert into products(title, description, price, image_url)
    values ${
      products
        .map(product => `(
          '${product.title}', 
          ${product.description ? `'${product.description}'` : null},
          ${product.price},
          ${product.imageUrl ? `'${product.imageUrl}'` : null}
        )`)
        .join(',')
    }
    returning id, title, description, price, image_url as imageUrl;
  `;
}
