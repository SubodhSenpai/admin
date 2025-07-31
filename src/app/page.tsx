import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, FolderOpen, Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto py-8 sm:py-10 px-6 sm:px-8 max-w-7xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4 sm:p-6 flex flex-col">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Products</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-2 flex-1">
            Manage your product catalog, add new products, and organize them by categories.
          </p>
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <Link href="/products">
              <Button className="border border-gray-300 dark:border-gray-600">
                <Plus className="mr-2 h-4 w-4" />
                Manage Products
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 sm:p-6 flex flex-col">
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Categories</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-2 flex-1">
            Create and manage product categories to organize your inventory effectively.
          </p>
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <Link href="/categories">
              <Button className="border border-gray-300 dark:border-gray-600">
                <Plus className="mr-2 h-4 w-4" />
                Manage Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
