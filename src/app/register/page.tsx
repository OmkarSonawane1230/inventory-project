"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Store, AlertCircle } from "lucide-react";
import { useAuth } from "../../contexts/auth-context";
import { useToast } from "../../hooks/use-toast";


const shopkeeperSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  shopName: z.string().min(2, "Shop name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  location: z.string().min(2, "Location is required"),
});

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type ShopkeeperFormData = z.infer<typeof shopkeeperSchema>;
type CustomerFormData = z.infer<typeof customerSchema>;


export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<'shopkeeper' | 'customer'>('shopkeeper');

  // Shopkeeper form
  const shopkeeperForm = useForm<ShopkeeperFormData>({
    resolver: zodResolver(shopkeeperSchema),
    defaultValues: {
      name: "",
      shopName: "",
      email: "",
      password: "",
      location: "",
    },
  });

  // Customer form
  const customerForm = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onShopkeeperSubmit = async (data: ShopkeeperFormData) => {
    setIsLoading(true);
    setError("");
    try {
      await register(data.email, data.password, data.name, 'shopkeeper', data.shopName, data.location);
      toast({
        title: "Registration successful",
        description: "Welcome to InventoryPro! Your shop is ready.",
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const onCustomerSubmit = async (data: CustomerFormData) => {
    setIsLoading(true);
    setError("");
    try {
      await register(data.email, data.password, data.name, 'customer');
      toast({
        title: "Registration successful",
        description: "Welcome to InventoryPro! You can now browse and shop.",
      });
      router.push("/customer");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Store className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">Register</CardTitle>
          <CardDescription>
            Create an account as a Shopkeeper or Customer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center gap-4 mb-6">
            <Button variant={role === 'shopkeeper' ? 'default' : 'outline'} onClick={() => setRole('shopkeeper')}>
              Shopkeeper
            </Button>
            <Button variant={role === 'customer' ? 'default' : 'outline'} onClick={() => setRole('customer')}>
              Customer
            </Button>
          </div>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {role === 'shopkeeper' ? (
            <Form {...shopkeeperForm}>
              <form onSubmit={shopkeeperForm.handleSubmit(onShopkeeperSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={shopkeeperForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={shopkeeperForm.control}
                    name="shopName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shop Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Store" {...field} data-testid="input-shop-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={shopkeeperForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} data-testid="input-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={shopkeeperForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} data-testid="input-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={shopkeeperForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State" {...field} data-testid="input-location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" size="lg" disabled={isLoading} data-testid="button-register">
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...customerForm}>
              <form onSubmit={customerForm.handleSubmit(onCustomerSubmit)} className="space-y-6">
                <FormField
                  control={customerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Customer" {...field} data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={customerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <Input type="email" placeholder="customer@example.com" {...field} data-testid="input-email" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={customerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <Input type="password" placeholder="••••••••" {...field} data-testid="input-password" />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" size="lg" disabled={isLoading} data-testid="button-register">
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </Form>
          )}
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline" data-testid="link-login">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
