import getAllProductsQuery from '@queries/get-all-products.query';

export default function(id: string) {
  return getAllProductsQuery.slice(0, -1).concat(` where p.id = '${id}';`);
}
