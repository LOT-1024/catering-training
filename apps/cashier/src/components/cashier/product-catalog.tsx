// src/components/cashier/product-catalog.tsx
import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { useProducts } from "../../hooks/use-products";
import type { Product } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton"; // Add this skeleton component
import { useDebounce } from "../../hooks/use-debounce";

const CATEGORIES = ["All", "Coffee", "Pastry", "Food", "Beverage"];

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
}

export function ProductCatalog({ onAddToCart }: ProductCatalogProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const debouncedSearch = useDebounce(search, 300); // 300ms delay

  const { products, loading, error, loadProducts } = useProducts();

  // Debounced category change to prevent rapid API calls
  useEffect(() => {
    const category = selectedCategory === "All" ? undefined : selectedCategory;
    loadProducts(category);
  }, [selectedCategory, loadProducts]);

  // Memoize filtered products to prevent unnecessary re-renders
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [products, search]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearch(""); // Clear search when changing category
  };

  // Skeleton loader component
  const ProductSkeleton = () => (
    <div className="h-auto flex flex-col items-start p-3 border border-border rounded-lg bg-card">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-2/3 mb-4" />
      <Skeleton className="h-6 w-1/2 mt-auto" />
    </div>
  );

  if (error) {
    return (
      <div className="flex flex-col flex-1 bg-background overflow-hidden items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive mb-4">
            Error loading products: {error}
          </p>
          <Button onClick={() => loadProducts()} variant="secondary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-background overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              onClick={() => handleCategoryChange(category)}
              variant={selectedCategory === category ? "default" : "secondary"}
              size="sm"
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <Button
                  key={product.id}
                  onClick={() => onAddToCart(product)}
                  variant="secondary"
                  disabled={product.inStock === false}
                  className="h-auto flex flex-col items-start p-3 hover:border-accent hover:bg-card/80 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-transparent"
                >
                  <h3 className="font-semibold text-card-foreground text-sm text-left">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 text-left">
                    {product.description}
                  </p>
                  {product.inStock === false && (
                    <span className="text-xs text-destructive mt-1">
                      Out of Stock
                    </span>
                  )}
                  <span className="text-primary font-bold text-lg mt-auto pt-2">
                    Rp {product.price.toLocaleString("id-ID")}
                  </span>
                </Button>
              ))}
            </div>

            {!loading && filteredProducts.length === 0 && (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p>No products found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
