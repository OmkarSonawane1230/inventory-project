"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: { id: string; name: string; price: number; imageUrl: string; stock: number }) => boolean;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number, maxStock?: number) => boolean;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: { id: string; name: string; price: number; imageUrl: string; stock: number }) => {
    let success = false;
    setItems(current => {
      const existing = current.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          success = false;
          return current;
        }
        success = true;
        return current.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, stock: product.stock }
            : item
        );
      }
      if (product.stock < 1) {
        success = false;
        return current;
      }
      success = true;
      return [...current, { ...product, quantity: 1, stock: product.stock }];
    });
    return success;
  };

  const removeFromCart = (id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number, maxStock?: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return true;
    }
    if (maxStock !== undefined && quantity > maxStock) {
      return false;
    }
    setItems(current =>
      current.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
    return true;
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      total, 
      itemCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
