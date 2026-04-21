import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { getProducts, saveProducts, addProduct as addProductStorage, updateProduct as updateProductStorage, deleteProduct as deleteProductStorage } from '../utils/storage';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getFeaturedProducts: () => Product[];
  getProductsByCategory: (category: string) => Product[];
  getCategories: () => string[];
  refreshProducts: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const addProduct = async (product: Product) => {
    await addProductStorage(product);
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = async (product: Product) => {
    await updateProductStorage(product);
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  };

  const deleteProduct = async (id: string) => {
    await deleteProductStorage(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProductById = (id: string) => products.find((p) => p.id === id);

  const getFeaturedProducts = () => products.filter((p) => p.featured);

  const getProductsByCategory = (category: string) =>
    category === 'All' ? products : products.filter((p) => p.category === category);

  const getCategories = () => {
    const cats = [...new Set(products.map((p) => p.category))];
    return ['All', ...cats];
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getFeaturedProducts,
        getProductsByCategory,
        getCategories,
        refreshProducts: loadProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
}
