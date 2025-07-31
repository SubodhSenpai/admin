export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  thumbnail?: string;
  images?: string[];
  tags?: string[];
  sku?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  reviews?: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  isDeleted?: boolean;
  deletedOn?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail?: string;
  images?: string[];
}

export interface CategoryFormData {
  name: string;
}
