export interface Product {
  count: number;
  description: string;
  id: string;
  price: number;
  title: string;
  imageUrl?: string;
}

export interface ProductListResponse {
  products: Product[];
}

export interface ProductDetailsResponse {
  product: Product
}
