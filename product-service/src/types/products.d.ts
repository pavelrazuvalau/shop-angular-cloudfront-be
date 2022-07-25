export interface BaseProduct {
  title: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

export interface ProductDetails extends BaseProduct {
  id: string;
  count?: number;
}

export interface ProductListResponse {
  products: ProductDetails[];
}

export interface ProductDetailsResponse {
  product: ProductDetails
}

export interface ProductCreationRequest {
  product: BaseProduct;
}
