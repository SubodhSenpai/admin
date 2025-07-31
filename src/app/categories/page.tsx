"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types";
import { categoriesApi } from "@/lib/api";
import { CategoryTable } from "@/components/categories/category-table";
import { CategoryForm } from "@/components/categories/category-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Pagination } from "@/components/ui/pagination";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const { toast } = useToast();

  const fetchCategories = async (page: number = 1) => {
    try {
      setLoading(true);
      const skip = (page - 1) * itemsPerPage;
      const data = await categoriesApi.getAll({ limit: itemsPerPage, skip });
      setCategories(data.categories);
      setTotalItems(data.total);
      setCurrentPage(page);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (data: { name: string }) => {
    try {
      await categoriesApi.create(data);
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      setDialogOpen(false);
      fetchCategories(currentPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: string, data: { name: string }) => {
    try {
      await categoriesApi.update(id, data);
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      setDialogOpen(false);
      setEditingCategory(null);
      fetchCategories(currentPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoriesApi.delete(id);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      fetchCategories(currentPage);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page: number) => {
    fetchCategories(page);
  };

  return (
    <div className="space-y-6 p-6 sm:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Categories</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <ThemeToggle />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)} variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-white/100 dark:text-white dark:hover:bg-white/10">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </DialogTitle>
              </DialogHeader>
              <CategoryForm
                initialData={editingCategory}
                onSubmit={editingCategory 
                  ? (data) => handleUpdate(editingCategory.id, data)
                  : handleCreate
                }
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

             <CategoryTable
         categories={categories}
         loading={loading}
         onEdit={(category) => {
           setEditingCategory(category);
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
