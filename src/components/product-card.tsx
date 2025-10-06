import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category?: string;
}

export function ProductCard({ id, name, description, price, imageUrl, stock, category }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const inStock = stock > 0;
  const lowStock = stock > 0 && stock <= 5;

  const handleAddToCart = () => {
    const success = addToCart({ id, name, price, imageUrl, stock });
    if (success) {
      toast({
        title: "Added to cart",
        description: `${name} has been added to your cart.`,
      });
    } else {
      toast({
        title: "Cannot add to cart",
        description: `You've reached the maximum available quantity for ${name}.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/400x300/e5e7eb/6b7280?text=${encodeURIComponent(name)}`;
          }}
        />
        <div className="absolute top-3 right-3">
          {!inStock ? (
            <Badge variant="destructive" data-testid="badge-stock-status">Out of Stock</Badge>
          ) : lowStock ? (
            <Badge className="bg-chart-3 text-white" data-testid="badge-stock-status">Low Stock</Badge>
          ) : (
            <Badge className="bg-chart-2 text-white" data-testid="badge-stock-status">In Stock</Badge>
          )}
        </div>
        {category && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" data-testid="badge-category">{category}</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1" data-testid="text-product-name">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3" data-testid="text-product-description">
          {description}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary" data-testid="text-product-price">
            ${price.toFixed(2)}
          </span>
          {stock > 0 && (
            <span className="text-xs text-muted-foreground" data-testid="text-stock-quantity">
              {stock} available
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          disabled={!inStock}
          onClick={handleAddToCart}
          data-testid="button-add-to-cart"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
