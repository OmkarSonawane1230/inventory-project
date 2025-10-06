"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, BarChart3, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Modern Inventory Management Made Simple
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Real-time inventory tracking for local shopkeepers. Manage products, monitor stock, and grow your business with ease.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild data-testid="button-get-started">
                <Link href="/register">
                  Get Started Free
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-view-products">
                <Link href="/customer">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Browse Products
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose InventoryPro?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
              <p className="text-muted-foreground">
                All inventory changes sync instantly across all devices. Never miss a stock update.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
              <p className="text-muted-foreground">
                Track your inventory with detailed insights and low-stock alerts to optimize your business.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Your data is protected with enterprise-grade security and automatic backups.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for Local Businesses</h2>
                <p className="text-muted-foreground mb-6">
                  InventoryPro is designed specifically for local shopkeepers who need a simple yet powerful way to manage their inventory. No technical knowledge required.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-chart-2/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-chart-2" />
                    </div>
                    <span>Easy product management with photos and descriptions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-chart-2/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-chart-2" />
                    </div>
                    <span>Automatic low stock notifications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-chart-2/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-chart-2" />
                    </div>
                    <span>Real-time customer product browsing</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Package className="h-32 w-32 text-primary/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Inventory?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of local shopkeepers who trust InventoryPro to manage their business.
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-cta-register">
            <Link href="/register">
              Start Managing Your Inventory
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
