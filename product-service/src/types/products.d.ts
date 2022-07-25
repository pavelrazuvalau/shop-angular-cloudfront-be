export interface BaseProduct {
  title: string;
  price: number;
  count: number;
  description?: string;
  imageUrl?: string;
}

// Repeat all properties, otherwise "extended" properties will not be shown on Swagger
export interface ProductDetails {
  id: string;
  title: string;
  price: number;
  count: number;
  description?: string;
  imageUrl?: string;
}

export interface ProductListResponse {
  products: ProductDetails[];
}

export interface ProductDetailsResponse {
  product: ProductDetails
}
