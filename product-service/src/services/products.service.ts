import { Product } from '../types/products';

import dbClient from '@libs/db-client';

import getAllProductsQuery from '@queries/get-all-products.query';
import getProductByIdQuery from '@queries/get-product-by-id.query';

class ProductsService {
  public getProducts(): Promise<Product[]> {
    return dbClient.getRecords<Product>(getAllProductsQuery);
  }

  public async getProductById(productId: string): Promise<Product | undefined> {
    const result = await dbClient.getRecords<Product>(getProductByIdQuery(productId));
    return result[0];
  }
}

export default new ProductsService();
