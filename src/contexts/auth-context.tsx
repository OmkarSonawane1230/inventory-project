"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { database, hasFirebaseConfig } from '../lib/firebase';


interface User {
  id: string;
  email: string;
  name: string;
  role: 'shopkeeper' | 'customer';
  shopName?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'shopkeeper' | 'customer', shopName?: string, location?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('auth_user');
      }
    }

    // Seed a few shopkeepers if not present
    async function seedShopkeepers() {
      const snap = await get(ref(database, 'shops'));
      if (!snap.exists()) {
        const demoShopkeepers = [
          { name: 'Alice Johnson', shopName: 'Alice Electronics', email: 'alice@shop.com', password: 'demo123', location: 'New York, NY' },
          { name: 'Bob Smith', shopName: 'Bob Sports Store', email: 'bob@shop.com', password: 'demo123', location: 'Los Angeles, CA' },
        ];
        for (const sk of demoShopkeepers) {
          const uid = Date.now().toString() + Math.floor(Math.random() * 10000).toString();
          await set(ref(database, `shops/${uid}`), {
            ...sk,
            createdAt: Date.now()
          });
        }
      }
    }
    seedShopkeepers();

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    if (hasFirebaseConfig && database) {
      // Find user by email and password in shops
      let userData: User | null = null;
      const shopsSnap = await get(ref(database, 'shops'));
      if (shopsSnap.exists()) {
        const shops = shopsSnap.val();
        for (const [uid, shop] of Object.entries(shops)) {
          const s = shop as any;
          if (s.email === email && s.password === password) {
            userData = {
              id: uid,
              email: s.email,
              name: s.name,
              role: 'shopkeeper',
              shopName: s.shopName,
              location: s.location
            };
            break;
          }
        }
      }
      // If not found in shops, check customers
      if (!userData) {
        const custSnap = await get(ref(database, 'customers'));
        if (custSnap.exists()) {
          const customers = custSnap.val();
          for (const [uid, cust] of Object.entries(customers)) {
            const c = cust as any;
            if (c.email === email && c.password === password) {
              userData = {
                id: uid,
                email: c.email,
                name: c.name,
                role: 'customer'
              };
              break;
            }
          }
        }
      }
      if (userData) {
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem('auth_user');
        throw new Error('Invalid credentials.');
      }
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: 'shopkeeper' | 'customer',
    shopName?: string,
    location?: string
  ) => {
    if (hasFirebaseConfig && database) {
      // Generate a unique id (timestamp-based)
      const uid = Date.now().toString();
      let userData: User;
      if (role === 'shopkeeper') {
        await set(ref(database, `shops/${uid}`), {
          name,
          shopName,
          email,
          password,
          location,
          createdAt: Date.now()
        });
        userData = {
          id: uid,
          email,
          name,
          role,
          shopName,
          location
        };
      } else {
        await set(ref(database, `customers/${uid}`), {
          name,
          email,
          password,
          createdAt: Date.now(),
          cart: []
        });
        userData = {
          id: uid,
          email,
          name,
          role
        };
      }
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
