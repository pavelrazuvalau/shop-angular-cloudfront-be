import products from "@mocks/products.mock.json";
import { Product } from '../types/products';

class ProductsService {
  private static instance: ProductsService;

  private constructor() { }

  public static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }

    return ProductsService.instance;
  }

  public async getProducts(): Promise<Product[]> {
    return Promise.resolve(products as Product[]);
  }

  public async getProductById(productId: string): Promise<Product | undefined> {
    return (products as Product[]).find(product => product.id === productId)
  }
}

export default ProductsService.getInstance();
