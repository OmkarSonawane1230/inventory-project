"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database, hasFirebaseConfig } from '@/lib/firebase';

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
  register: (email: string, password: string, name: string, shopName: string, location: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DUMMY_USERS: User[] = [
  {
    id: 'shopkeeper-1',
    email: 'alice@shop.com',
    name: 'Alice Johnson',
    role: 'shopkeeper',
    shopName: 'Alice Electronics',
    location: 'New York, NY'
  },
  {
    id: 'shopkeeper-2',
    email: 'bob@shop.com',
    name: 'Bob Smith',
    role: 'shopkeeper',
    shopName: 'Bob Sports Store',
    location: 'Los Angeles, CA'
  },
  {
    id: 'customer-1',
    email: 'carol@customer.com',
    name: 'Carol Williams',
    role: 'customer'
  },
  {
    id: 'customer-2',
    email: 'david@customer.com',
    name: 'David Brown',
    role: 'customer'
  }
];

const DUMMY_PASSWORD = 'demo123';

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

    if (hasFirebaseConfig && auth) {
      // Listen to Firebase auth state
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userData: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'User',
            role: 'shopkeeper',
          };
          setUser(userData);
          localStorage.setItem('auth_user', JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem('auth_user');
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (hasFirebaseConfig && auth) {
      // Firebase login
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userData: User = {
        id: result.user.uid,
        email: result.user.email || '',
        name: result.user.displayName || 'User',
        role: 'shopkeeper',
      };
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } else {
      // Dummy login for demo
      const dummyUser = DUMMY_USERS.find(u => u.email === email);
      if (dummyUser && password === DUMMY_PASSWORD) {
        setUser(dummyUser);
        localStorage.setItem('auth_user', JSON.stringify(dummyUser));
      } else {
        throw new Error('Invalid credentials. Try alice@shop.com, bob@shop.com, carol@customer.com, or david@customer.com with password: demo123');
      }
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    shopName: string, 
    location: string
  ) => {
    if (hasFirebaseConfig && auth && database) {
      // Firebase registration
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const shopId = result.user.uid;
      
      // Store shopkeeper data
      await set(ref(database, `shops/${shopId}`), {
        name,
        shopName,
        email,
        location,
        createdAt: Date.now()
      });

      const userData: User = {
        id: shopId,
        email,
        name,
        role: 'shopkeeper',
        shopName,
        location
      };
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } else {
      // Dummy registration for demo - just log them in as demo user
      const userData: User = {
        id: 'demo-' + Date.now(),
        email,
        name,
        role: 'shopkeeper',
        shopName,
        location
      };
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
    }
  };

  const logout = async () => {
    if (hasFirebaseConfig && auth) {
      await firebaseSignOut(auth);
    }
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
