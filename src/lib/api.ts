import axios from 'axios';
import { Product, Category } from '@/types';

const API_BASE = 'https://dummyjson.com';

// Products API
export const productsApi = {
  getAll: async (params?: { 
    limit?: number; 
    skip?: number; 
    search?: string;
    category?: string;
  }) => {
    let url = `${API_BASE}/products`;
    
    if (params?.category) {
      url = `${API_BASE}/products/category/${params.category}`;
    } else if (params?.search) {
      // For category search, we'll get all products and filter by category
      if (params.search.startsWith('category:')) {
        const categoryName = params.search.replace('category:', '').trim();
        url = `${API_BASE}/products/category/${categoryName}`;
      } else {
        // Regular title search
        url = `${API_BASE}/products/search?q=${params.search}`;
      }
      // For search endpoints, we can't use limit/skip as they're not supported
      const response = await axios.get(url);
      return response.data;
    } else {
      url = `${API_BASE}/products`;
    }
    
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.skip) queryParams.append('skip', params.skip.toString());
    
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await axios.get(`${API_BASE}/products/${id}`);
    return response.data;
  },

  create: async (product: Omit<Product, 'id'>) => {
    const response = await axios.post(`${API_BASE}/products/add`, product);
    return response.data;
  },

  update: async (id: number, product: Partial<Product>) => {
    const response = await axios.put(`${API_BASE}/products/${id}`, product);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axios.delete(`${API_BASE}/products/${id}`);
    return response.data;
  },
};

// Categories API (simulated with localStorage)
export const categoriesApi = {
  getAll: async (params?: { limit?: number; skip?: number }): Promise<{ categories: Category[]; total: number; skip: number; limit: number }> => {
    if (typeof window === 'undefined') return { categories: [], total: 0, skip: 0, limit: 10 };
    const stored = localStorage.getItem('categories');
    let categories: Category[] = [];
    
    if (!stored) {
      // Initialize with DummyJSON categories
      const response = await axios.get(`${API_BASE}/products/category-list`);
      categories = response.data.map((cat: string, index: number) => ({
        id: `cat-${index}`,
        name: cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' '),
        slug: cat,
      }));
      localStorage.setItem('categories', JSON.stringify(categories));
    } else {
      categories = JSON.parse(stored);
    }
    
    const total = categories.length;
    const limit = params?.limit || 10;
    const skip = params?.skip || 0;
    const paginatedCategories = categories.slice(skip, skip + limit);
    
    return {
      categories: paginatedCategories,
      total,
      skip,
      limit,
    };
  },

  // slug is computed here, so callers only need to pass the name
  create: async (category: Pick<Category, 'name'>): Promise<Category> => {
    const result = await categoriesApi.getAll();
    const categories = result.categories;
    const allCategories = await categoriesApi.getAll({ limit: 1000, skip: 0 });
    const newCategory = {
      ...category,
      id: `cat-${Date.now()}`,
      slug: category.name.toLowerCase().replace(/\s+/g, '-'),
    };
    const updated = [...allCategories.categories, newCategory];
    localStorage.setItem('categories', JSON.stringify(updated));
    return newCategory;
  },

  update: async (id: string, category: Partial<Category>): Promise<Category> => {
    const result = await categoriesApi.getAll({ limit: 1000, skip: 0 });
    const categories = result.categories;
    const index = categories.findIndex((c: Category) => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    const updated = [...categories];
    updated[index] = { ...updated[index], ...category };
    if (category.name) {
      updated[index].slug = category.name.toLowerCase().replace(/\s+/g, '-');
    }
    
    localStorage.setItem('categories', JSON.stringify(updated));
    return updated[index];
  },

  delete: async (id: string): Promise<void> => {
    const result = await categoriesApi.getAll({ limit: 1000, skip: 0 });
    const categories = result.categories;
    const filtered = categories.filter((c: Category) => c.id !== id);
    localStorage.setItem('categories', JSON.stringify(filtered));
  },
};
