"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Tag, Home } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Products", href: "/products", icon: Package },
  { name: "Categories", href: "/categories", icon: Tag },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:block w-64 bg-card border-r border-border shadow-lg">
      <div className="p-6">
        <h1 className="text-5xl font-bold text-foreground align-middle">
          Admin
        </h1>
      </div>
      
      <nav className="mt-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent-foreground text-accent border-r-2 border-primary"
                  : "text-muted-foreground hover:bg-primary\/10 hover:text-foreground"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
