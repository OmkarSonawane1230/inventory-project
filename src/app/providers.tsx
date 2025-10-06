"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "../components/theme-provider";
import { AuthProvider } from "../contexts/auth-context";
import { CartProvider } from "../contexts/cart-context";
// import { Toaster } from "@/components/ui/toaster";

export const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <CartProvider>
            {/* <TooltipProvider> */}
              {children}
              {/* <Toaster /> */}
            {/* </TooltipProvider> */}
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
