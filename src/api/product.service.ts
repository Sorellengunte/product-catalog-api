import { apiService } from './api.service';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail?: string;
  images?: string[];
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

class ProductService {
  private basePath = '/products';

  // CREATE - Créer un produit
  async createProduct(data: CreateProductData): Promise<Product> {
    return apiService.post<Product>(`${this.basePath}/add`, data);
  }

  // READ - Récupérer tous les produits
  async getAllProducts(limit: number = 10, skip: number = 0): Promise<ProductsResponse> {
    return apiService.get<ProductsResponse>(this.basePath, { limit, skip });
  }

  // READ - Récupérer un produit par ID
  async getProductById(id: number): Promise<Product> {
    return apiService.get<Product>(`${this.basePath}/${id}`);
  }

  // READ - Rechercher des produits
  async searchProducts(query: string): Promise<ProductsResponse> {
    return apiService.get<ProductsResponse>(`${this.basePath}/search`, { q: query });
  }

  // READ - Produits par catégorie
  async getProductsByCategory(category: string): Promise<ProductsResponse> {
    return apiService.get<ProductsResponse>(`${this.basePath}/category/${category}`);
  }

  // READ - Toutes les catégories
  async getAllCategories(): Promise<string[]> {
    return apiService.get<string[]>(`${this.basePath}/categories`);
  }

  // UPDATE - Mettre à jour un produit
  async updateProduct(id: number, data: Partial<CreateProductData>): Promise<Product> {
    return apiService.put<Product>(`${this.basePath}/${id}`, data);
  }

  // UPDATE - Mettre à jour partiellement
  async patchProduct(id: number, data: Partial<CreateProductData>): Promise<Product> {
    return apiService.patch<Product>(`${this.basePath}/${id}`, data);
  }

  // DELETE - Supprimer un produit
  async deleteProduct(id: number): Promise<{ id: number; deleted: boolean }> {
    return apiService.delete<{ id: number; deleted: boolean }>(`${this.basePath}/${id}`);
  }

  // Méthodes avancées
  async getProductsWithFilters(filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    limit?: number;
    skip?: number;
  }): Promise<ProductsResponse> {
    const params = { ...filters };
    return apiService.get<ProductsResponse>(this.basePath, params);
  }

  async getProductStats() {
    const [products, categories] = await Promise.all([
      this.getAllProducts(0, 0),
      this.getAllCategories(),
    ]);

    return {
      totalProducts: products.total,
      totalCategories: categories.length,
      averagePrice: products.products.reduce((sum, p) => sum + p.price, 0) / products.products.length,
      averageRating: products.products.reduce((sum, p) => sum + p.rating, 0) / products.products.length,
    };
  }
}

export const productService = new ProductService();