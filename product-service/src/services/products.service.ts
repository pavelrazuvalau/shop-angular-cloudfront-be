import { BaseProduct, ProductDetails } from '../types/products';

import dbClient from '@libs/db-client';

import getAllProductsQuery from '@queries/get-all-products.query';
import getProductByIdQuery from '@queries/get-product-by-id.query';
import createProductQuery from '@queries/create-product.query';
import createStockQuery from '@queries/create-stock.query';
import createProductsBatchQuery from '@queries/create-products-batch.query';
import createStocksBatchQuery from '@queries/create-stocks-batch.query';

class ProductsService {
  public getProducts(): Promise<ProductDetails[]> {
    return dbClient.performQuery<ProductDetails>(getAllProductsQuery);
  }

  public async getProductById(productId: string): Promise<ProductDetails | undefined> {
    const [result] = await dbClient.performQuery<ProductDetails>(getProductByIdQuery(productId));

    return result;
  }

  public async createProduct(product: BaseProduct): Promise<ProductDetails> {
    try {
      await dbClient.beginTransaction();

      const [productResult] = await dbClient.performQuery<ProductDetails>(createProductQuery(product));

      if (!productResult) {
        throw new Error(`Product creation error. ${JSON.stringify(product)}`);
      }

      const [stockResult] = await dbClient.performQuery<ProductDetails>(createStockQuery({
        ...product,
        ...productResult
      }));

      if (!stockResult) {
        throw new Error(`Stock creation error. ${JSON.stringify(product)}`);
      }

      await dbClient.commitTransaction();

      return {
        ...productResult,
        count: stockResult.count
      };
    } catch (error) {
      await dbClient.rollbackTransaction();

      throw error;
    }
  }

  public async createBatchOfProducts(products: BaseProduct[]): Promise<ProductDetails[]> {
    try {
      await dbClient.beginTransaction();

      const productResults = await dbClient.performQuery<ProductDetails>(createProductsBatchQuery(products));

      if (!productResults?.length) {
        throw new Error(`Products batch creation error. ${JSON.stringify(products)}`);
      }

      const stockResults = await dbClient.performQuery<ProductDetails>(createStocksBatchQuery(
        productResults.map((product, index) => ({
          id: product.id,
          count: products[index].count
        }))
      ));

      if (!stockResults.length) {
        throw new Error(`Stocks batch creation error. ${JSON.stringify(products)}`);
      }

      await dbClient.commitTransaction();

      return productResults.map((product, index) => ({
        ...product,
        count: stockResults[index].count
      }))
    } catch (error) {
      await dbClient.rollbackTransaction();

      throw error;
    }
  }
}

export default new ProductsService();
