import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useCart } from "../contexts/cart-context";
import { Badge } from "./ui/badge";
import { useToast } from "../hooks/use-toast";
import { ref, get, update } from "firebase/database";
import { database } from "../lib/firebase";

export function CartSheet() {
  const { items, removeFromCart, updateQuantity, total, itemCount, clearCart } = useCart();
  const { toast } = useToast();

  const handleCheckout = async () => {
    // Decrement stock in Firebase for each item
    for (const item of items) {
      const prodRef = ref(database, `products/${item.id}`);
      const snap = await get(prodRef);
      if (snap.exists()) {
        const prod = snap.val();
        const newStock = Math.max(0, (prod.stock || 0) - item.quantity);
        await update(prodRef, { stock: newStock });
      }
    }
    alert(`Order placed! Total: ₹${total.toFixed(2)}\n\nThank you for your purchase!`);
    clearCart();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative" data-testid="button-cart">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              data-testid="badge-cart-count"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {itemCount === 0 ? "Your cart is empty" : `${itemCount} item${itemCount > 1 ? 's' : ''} in cart`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Start shopping to add items</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-20 w-20 rounded-md object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/100x100/e5e7eb/6b7280?text=${encodeURIComponent(item.name)}`;
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold line-clamp-1" data-testid={`text-cart-item-${item.id}`}>
                      {item.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        data-testid={`button-decrease-${item.id}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center" data-testid={`text-quantity-${item.id}`}>
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          const success = updateQuantity(item.id, item.quantity + 1, item.stock);
                          if (!success) {
                            toast({
                              title: "Maximum quantity reached",
                              description: `Only ${item.stock} available in stock.`,
                              variant: "destructive",
                            });
                          }
                        }}
                        data-testid={`button-increase-${item.id}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto"
                        onClick={() => removeFromCart(item.id)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span data-testid="text-cart-total">₹{total.toFixed(2)}</span>
            </div>
            <Button className="w-full" size="lg" onClick={handleCheckout} data-testid="button-checkout">
              Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
