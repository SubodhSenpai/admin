"use client";

import { Category } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { useState } from "react";

interface CategoryTableProps {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => Promise<void>;
}

export function CategoryTable({ categories, loading, onEdit, onDelete }: CategoryTableProps) {
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-lg shadow border border-white/100 dark:border-white/100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground min-w-[150px]">Name</TableHead>
                <TableHead className="text-foreground min-w-[150px] hidden sm:table-cell">Slug</TableHead>
                <TableHead className="w-24 text-foreground min-w-[96px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="text-foreground">{cat.name}</TableCell>
                <TableCell className="lowercase text-muted-foreground hidden sm:table-cell">{cat.slug}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onEdit(cat)}
                      className="bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setDeleteCategory(cat)}
                      className="bg-background hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </div>
      </div>

      <DeleteCategoryDialog
        category={deleteCategory}
        open={!!deleteCategory}
        onClose={() => setDeleteCategory(null)}
        onConfirm={async () => {
          if (deleteCategory) {
            await onDelete(deleteCategory.id);
            setDeleteCategory(null);
          }
        }}
      />
    </>
  );
}
