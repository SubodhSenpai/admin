"use client";

import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { DeleteProductDialog } from "./delete-product-dialog";
import { useState } from "react";

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => Promise<void>;
}

export function ProductTable({ products, loading, onEdit, onDelete }: ProductTableProps) {
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

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
                <TableHead className="w-16 min-w-[64px]">Image</TableHead>
                <TableHead className="text-foreground min-w-[200px]">Title</TableHead>
                <TableHead className="text-foreground min-w-[120px] hidden sm:table-cell">Category</TableHead>
                <TableHead className="text-foreground min-w-[80px]">Price</TableHead>
                <TableHead className="text-foreground min-w-[80px] hidden md:table-cell">Stock</TableHead>
                <TableHead className="w-24 text-foreground min-w-[96px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.thumbnail || (product.images?.[0] ?? '/placeholder.jpg')}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.jpg';
                    }}
                  />
                </TableCell>
                <TableCell className="font-medium text-foreground">{product.title}</TableCell>
                <TableCell className="capitalize text-muted-foreground hidden sm:table-cell">{product.category?.replace('-', ' ')}</TableCell>
                <TableCell className="text-foreground">${product.price}</TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">{product.stock || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteProduct(product)}
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

      <DeleteProductDialog
        product={deleteProduct}
        open={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={async () => {
          if (deleteProduct) {
            await onDelete(deleteProduct.id);
            setDeleteProduct(null);
          }
        }}
      />
    </>
  );
}
