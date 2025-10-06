"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    stock: 12,
    category: "Electronics"
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Fitness tracking smartwatch with heart rate monitor and GPS",
    price: 299.99,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    stock: 8,
    category: "Electronics"
  },
  {
    id: "3",
    name: "Running Shoes",
    description: "Lightweight running shoes with advanced cushioning technology",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    stock: 0,
    category: "Sports"
  },
  {
    id: "4",
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop",
    stock: 15,
    category: "Home"
  },
  {
    id: "5",
    name: "Yoga Mat",
    description: "Non-slip yoga mat with carrying strap",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop",
    stock: 3,
    category: "Sports"
  },
  {
    id: "6",
    name: "Backpack",
    description: "Durable laptop backpack with multiple compartments",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    stock: 20,
    category: "Other"
  }
];

const CATEGORIES = ["All", "Electronics", "Clothing", "Food", "Home", "Sports", "Books", "Other"];

export default function Customer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 via-background to-background py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Browse Our Products</h1>
            <p className="text-muted-foreground text-lg">
              Discover quality products from local shopkeepers
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
                data-testid="input-search-products"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-10 bg-background/80 backdrop-blur-lg border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex-shrink-0"
                data-testid={`button-category-${category.toLowerCase()}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No products found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
