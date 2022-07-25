import products from '@mocks/products.mock.json';

export default products.reduce((resultQuery, currentProduct) => resultQuery.concat(`
  insert into products(title, description, price) values ('${currentProduct.title}', '${currentProduct.description}', ${currentProduct.price});
  insert into stocks(product_id, count) values ((select id from products where title = '${currentProduct.title}'), ${currentProduct.count});
`), '');
