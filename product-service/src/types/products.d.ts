export interface ProductModel {
  count: number;
  description: string;
  id: string;
  price: number;
  title: string;
  imageUrl?: string;
}

export type ProductsListModel = ProductModel[]
