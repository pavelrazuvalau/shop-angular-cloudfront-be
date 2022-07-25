import { BaseProduct, ProductDetails } from '../types/products';

import dbClient from '@libs/db-client';

import getAllProductsQuery from '@queries/get-all-products.query';
import getProductByIdQuery from '@queries/get-product-by-id.query';
import createProductQuery from '@queries/create-product.query';

class ProductsService {
  public getProducts(): Promise<ProductDetails[]> {
    return dbClient.performQuery<ProductDetails>(getAllProductsQuery);
  }

  public async getProductById(productId: string): Promise<ProductDetails | undefined> {
    const [result] = await dbClient.performQuery<ProductDetails>(getProductByIdQuery(productId));

    return result;
  }

  public async createProduct(product: BaseProduct): Promise<ProductDetails> {
    const [result] = await dbClient.performQuery<ProductDetails>(createProductQuery(product));

    if (!result) {
      throw new Error(`Entity creation error. ${JSON.stringify(product)}`);
    }

    return result;
  }
}

export default new ProductsService();
