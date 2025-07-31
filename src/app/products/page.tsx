"use client";

import { useState, useEffect } from "react";
import { Product, Category } from "@/types";
import { productsApi, categoriesApi } from "@/lib/api";
import { ProductTable } from "@/components/products/product-table";
import { ProductForm } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Pagination } from "@/components/ui/pagination";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const { toast } = useToast();

  const fetchProducts = async (search?: string, category?: string, page: number = 1) => {
    try {
      setLoading(true);
      
      if (search || category) {
        // Search or category filter doesn't support pagination, so we get all results and paginate client-side
        const searchTerm = category ? `category:${category}` : search;
        const data = await productsApi.getAll({ search: searchTerm });
        const allProducts = data.products;
        const total = allProducts.length;
        const skip = (page - 1) * itemsPerPage;
        const paginatedProducts = allProducts.slice(skip, skip + itemsPerPage);
        
        setProducts(paginatedProducts);
        setTotalItems(total);
        setCurrentPage(page);
      } else {
        // Normal pagination for non-search
        const skip = (page - 1) * itemsPerPage;
        const data = await productsApi.getAll({
          limit: itemsPerPage,
          skip,
        });
        setProducts(data.products);
        setTotalItems(data.total);
        setCurrentPage(page);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll({ limit: 1000, skip: 0 });
      setCategories(data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Refresh categories when dialog opens (to get any newly added categories)
  useEffect(() => {
    if (dialogOpen) {
      fetchCategories();
    }
  }, [dialogOpen]);

  // Refresh categories when page becomes visible (in case user added categories in another tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchCategories();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', fetchCategories);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', fetchCategories);
    };
  }, []);

  const handleSearch = () => {
    const categoryToSearch = selectedCategory === "all" ? "" : selectedCategory;
    fetchProducts(searchQuery, categoryToSearch, 1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const categoryToSearch = category === "all" ? "" : category;
    fetchProducts(searchQuery, categoryToSearch, 1);
  };

  const handlePageChange = (page: number) => {
    const categoryToSearch = selectedCategory === "all" ? "" : selectedCategory;
    fetchProducts(searchQuery, categoryToSearch, page);
  };

  const handleCreate = async (data: Omit<Product, 'id'>) => {
    try {
      await productsApi.create(data);
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      setDialogOpen(false);
      const categoryToSearch = selectedCategory === "all" ? "" : selectedCategory;
      fetchProducts(searchQuery, categoryToSearch, currentPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: number, data: Partial<Product>) => {
    try {
      await productsApi.update(id, data);
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      setDialogOpen(false);
      setEditingProduct(null);
      const categoryToSearch = selectedCategory === "all" ? "" : selectedCategory;
      fetchProducts(searchQuery, categoryToSearch, currentPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await productsApi.delete(id);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      const categoryToSearch = selectedCategory === "all" ? "" : selectedCategory;
      fetchProducts(searchQuery, categoryToSearch, currentPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 p-6 sm:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Products</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <ThemeToggle />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)} variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-white/100 dark:text-white dark:hover:bg-white/10">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                initialData={editingProduct}
                onSubmit={editingProduct 
                  ? (data) => handleUpdate(editingProduct.id, data)
                  : handleCreate
                }
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 w-full"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border-border max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
              <SelectItem value="all" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug} className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSearch} variant="outline" className="w-full sm:w-auto">
            Search
          </Button>
        </div>
      </div>

             <ProductTable
         products={products}
         loading={loading}
         onEdit={(product) => {
           setEditingProduct(product);
           setDialogOpen(true);
         }}
         onDelete={handleDelete}
       />
       
       {totalItems > 0 && (
         <div className="mt-6">
           <Pagination
             currentPage={currentPage}
             totalPages={Math.ceil(totalItems / itemsPerPage)}
             onPageChange={handlePageChange}
             totalItems={totalItems}
             itemsPerPage={itemsPerPage}
           />
         </div>
       )}
     </div>
   );
 }
