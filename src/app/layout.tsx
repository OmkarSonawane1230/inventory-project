import type { Metadata } from "next";
import { Providers } from "./providers";
import { Navbar } from "../components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "InventoryPro - Modern Inventory Management",
  description: "Real-time inventory tracking for local shopkeepers. Manage products, monitor stock, and grow your business with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
