"use client";

import { useState, useEffect } from "react";
import { get, ref, set, update, remove, push } from "firebase/database";
import { database } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/auth-context";
import { StatsCard } from "../../components/stats-card";
import { ProductForm } from "../../components/product-form";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Package, AlertTriangle, IndianRupee, Plus, Pencil, Trash2 } from "lucide-react";




type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  description?: string;
};

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  // Add demo products if database is empty
  useEffect(() => {
    async function seedProductsIfEmpty() {
      const snap = await get(ref(database, "products"));
      if (!snap.exists()) {
        const demoProducts = [
          // Electronics
          { name: "Wireless Headphones", category: "Electronics", price: 199.99, stock: 12, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop", description: "Premium noise-cancelling wireless headphones." },
          { name: "Smart Watch", category: "Electronics", price: 299.99, stock: 8, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop", description: "Fitness tracking smartwatch." },
          // Sports
          { name: "Running Shoes", category: "Sports", price: 129.99, stock: 0, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop", description: "Lightweight running shoes." },
          { name: "Yoga Mat", category: "Sports", price: 39.99, stock: 3, imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=100&h=100&fit=crop", description: "Non-slip yoga mat." },
          // Home
          { name: "Coffee Maker", category: "Home", price: 89.99, stock: 15, imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=100&h=100&fit=crop", description: "Programmable coffee maker." },
          // Clothing
          { name: "Denim Jacket", category: "Clothing", price: 59.99, stock: 10, imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=100&h=100&fit=crop", description: "Classic denim jacket." },
          // Food
          { name: "Organic Honey", category: "Food", price: 14.99, stock: 25, imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop", description: "Pure organic honey." },
          // Books
          { name: "Mystery Novel", category: "Books", price: 19.99, stock: 7, imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=100&fit=crop", description: "Bestselling mystery novel." },
          // Other
          { name: "Backpack", category: "Other", price: 79.99, stock: 20, imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop", description: "Durable laptop backpack." },
        ];
        // Prevent duplicates by checking for existing product names
        const existingNames = new Set();
        for (const prod of demoProducts) {
          if (!existingNames.has(prod.name)) {
            const newRef = push(ref(database, "products"));
            await set(newRef, { ...prod, stock: prod.stock, price: prod.price });
            existingNames.add(prod.name);
          }
        }
      }
    }
    seedProductsIfEmpty();
  }, []);

  // Fetch products from Firebase
  useEffect(() => {
    if (!user || user.role !== 'shopkeeper') {
      router.push('/');
      return;
    }
    async function fetchProducts() {
      setLoading(true);
      const snap = await get(ref(database, "products"));
      if (snap.exists()) {
        const data = snap.val();
        const loaded: Product[] = Object.entries(data).map(([id, prod]: any) => ({ id, ...prod }));
        setProducts(loaded);
      } else {
        setProducts([]);
      }
      setLoading(false);
    }
    fetchProducts();
  }, [user, router]);

  if (!user || user.role !== 'shopkeeper') {
    return null;
  }

  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  const handleAddProduct = async (data: any) => {
    const newRef = push(ref(database, "products"));
    await set(newRef, {
      name: data.name,
      category: data.category,
      price: parseFloat(data.price),
      stock: parseInt(data.quantity),
      imageUrl: data.imageUrl || 'https://placehold.co/400x300/e5e7eb/6b7280?text=' + encodeURIComponent(data.name),
      description: data.description,
    });
    setIsDialogOpen(false);
    setEditingProduct(null);
    // Refresh products
    const snap = await get(ref(database, "products"));
    if (snap.exists()) {
      const data = snap.val();
      const loaded: Product[] = Object.entries(data).map(([id, prod]: any) => ({ id, ...prod }));
      setProducts(loaded);
    }
  };

  const handleEditProduct = async (data: any) => {
    if (!editingProduct) return;
    await update(ref(database, `products/${editingProduct.id}`), {
      name: data.name,
      category: data.category,
      price: parseFloat(data.price),
      stock: parseInt(data.quantity),
      imageUrl: data.imageUrl || editingProduct.imageUrl,
      description: data.description,
    });
    setIsDialogOpen(false);
    setEditingProduct(null);
    // Refresh products
    const snap = await get(ref(database, "products"));
    if (snap.exists()) {
      const data = snap.val();
      const loaded: Product[] = Object.entries(data).map(([id, prod]: any) => ({ id, ...prod }));
      setProducts(loaded);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    await remove(ref(database, `products/${id}`));
    // Refresh products
    const snap = await get(ref(database, "products"));
    if (snap.exists()) {
      const data = snap.val();
      const loaded: Product[] = Object.entries(data).map(([id, prod]: any) => ({ id, ...prod }));
      setProducts(loaded);
    }
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Loading products...</p>
          </div>
        ) : (
        <>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your inventory and track performance</p>
          </div>
          <Button onClick={openAddDialog} data-testid="button-add-product">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
  </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Products"
            value={totalProducts}
            icon={Package}
            description="Active in inventory"
          />
          <StatsCard
            title="Low Stock"
            value={lowStockProducts}
            icon={AlertTriangle}
            description="Need restocking"
          />
          <StatsCard
            title="Out of Stock"
            value={outOfStock}
            icon={AlertTriangle}
            description="Requires attention"
          />
          <StatsCard
            title="Inventory Value"
            value={`₹${totalValue.toFixed(2)}`}
            icon={IndianRupee}
            description="Total stock value"
          />
        </div>

  <Card>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://placehold.co/100x100/e5e7eb/6b7280?text=${encodeURIComponent(product.name)}`;
                            }}
                          />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        {product.stock === 0 ? (
                          <Badge variant="destructive">Out of Stock</Badge>
                        ) : product.stock <= 5 ? (
                          <Badge className="bg-chart-3 text-white">Low Stock</Badge>
                        ) : (
                          <Badge className="bg-chart-2 text-white">In Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(product)}
                            data-testid={`button-edit-${product.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(product.id)}
                            data-testid={`button-delete-${product.id}`}
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
          </CardContent>
        </Card>
        </>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? 'Update the details below to modify the product.'
                : 'Fill in the details below to add a new product to your inventory.'
              }
            </DialogDescription>
          </DialogHeader>
          <ProductForm 
            onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
            initialData={editingProduct ? {
              name: editingProduct.name,
              description: editingProduct.description || '',
              price: editingProduct.price.toString(),
              quantity: editingProduct.stock.toString(),
              category: editingProduct.category,
              imageUrl: editingProduct.imageUrl,
            } : undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
