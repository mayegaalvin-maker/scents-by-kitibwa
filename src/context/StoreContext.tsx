import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Product, ProductDraft } from '../types';

const PRODUCTS_KEY = 'scents-by-kitiibwa-products-v2';
const OWNER_PIN_KEY = 'scents-by-kitiibwa-owner-pin-v1';

interface StoreContextValue {
  products: Product[];
  ownerPinHash: string | null;
  isOwnerSignedIn: boolean;
  signInOwner: () => void;
  signOutOwner: () => void;
  saveOwnerPin: (pin: string) => Promise<void>;
  verifyOwnerPin: (pin: string) => Promise<boolean>;
  addProduct: (draft: ProductDraft) => void;
  updateProduct: (id: string, draft: ProductDraft) => void;
  deleteProduct: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function readProducts(): Product[] {
  try {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    if (!saved) return [];
    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? (parsed as Product[]) : [];
  } catch {
    return [];
  }
}

async function hashPin(pin: string): Promise<string> {
  const bytes = new TextEncoder().encode(pin);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(readProducts);
  const [ownerPinHash, setOwnerPinHash] = useState<string | null>(() => {
    try {
      return localStorage.getItem(OWNER_PIN_KEY);
    } catch {
      return null;
    }
  });
  const [isOwnerSignedIn, setIsOwnerSignedIn] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch {
      window.dispatchEvent(new CustomEvent('store-storage-error'));
    }
  }, [products]);

  const saveOwnerPin = async (pin: string) => {
    const hashedPin = await hashPin(pin);
    localStorage.setItem(OWNER_PIN_KEY, hashedPin);
    setOwnerPinHash(hashedPin);
  };

  const verifyOwnerPin = async (pin: string) => (await hashPin(pin)) === ownerPinHash;

  const addProduct = (draft: ProductDraft) => {
    setProducts((current) => [{ ...draft, id: crypto.randomUUID(), createdAt: Date.now() }, ...current]);
  };

  const updateProduct = (id: string, draft: ProductDraft) => {
    setProducts((current) => current.map((product) => product.id === id ? { ...product, ...draft } : product));
  };

  const deleteProduct = (id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      products,
      ownerPinHash,
      isOwnerSignedIn,
      signInOwner: () => setIsOwnerSignedIn(true),
      signOutOwner: () => setIsOwnerSignedIn(false),
      saveOwnerPin,
      verifyOwnerPin,
      addProduct,
      updateProduct,
      deleteProduct,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside StoreProvider');
  return context;
}