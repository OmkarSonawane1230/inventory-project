"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { CartSheet } from "./cart-sheet";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, LayoutDashboard, UserPlus, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) => pathname === path;
  const isShopkeeper = user?.role === 'shopkeeper';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 hover-elevate rounded-md px-2 py-1">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">InventoryPro</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Button
            variant={isActive("/") ? "secondary" : "ghost"}
            asChild
            data-testid="link-home"
          >
            <Link href="/">Home</Link>
          </Button>
          <Button
            variant={isActive("/customer") ? "secondary" : "ghost"}
            asChild
            data-testid="link-customer"
          >
            <Link href="/customer">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Products
            </Link>
          </Button>
          {isShopkeeper && (
            <Button
              variant={isActive("/dashboard") ? "secondary" : "ghost"}
              asChild
              data-testid="link-dashboard"
            >
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <CartSheet />
          <ThemeToggle />
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                data-testid="link-login"
              >
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button
                variant="default"
                size="sm"
                asChild
                data-testid="link-register"
              >
                <Link href="/register">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
