import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, Batch, HistoryEntry, User } from '../types';

interface DataContextType {
  products: Product[];
  batches: Batch[];
  history: HistoryEntry[];
  users: User[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, userId: string, userName: string) => Product;
  updateProduct: (product: Product, userId: string, userName: string, changes: string) => void;
  deleteProduct: (id: string, userId: string, userName: string) => void;
  getProductByBarcode: (barcode: string) => Product | undefined;
  getBatchesByProductId: (productId: string) => Batch[];
  addBatch: (batch: Omit<Batch, 'id' | 'createdAt' | 'updatedAt'>, userId: string, userName: string) => void;
  updateBatch: (batch: Batch, userId: string, userName: string, changes: string) => void;
  deleteBatch: (id: string, userId: string, userName: string) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load products
    const productsJson = localStorage.getItem('products_v2');
    if (productsJson) {
      setProducts(JSON.parse(productsJson));
    } else {
      // Initialize with sample data
      const sampleProducts: Product[] = [
        {
          id: '1',
          name: 'Leche Entera',
          barcode: '7790001234567',
          createdAt: new Date().toISOString(),
          createdBy: '1',
          updatedAt: new Date().toISOString(),
          updatedBy: '1',
        },
        {
          id: '2',
          name: 'Yogurt Natural',
          barcode: '7790002345678',
          createdAt: new Date().toISOString(),
          createdBy: '1',
          updatedAt: new Date().toISOString(),
          updatedBy: '1',
        },
        {
          id: '3',
          name: 'Manteca',
          barcode: '7790003456789',
          createdAt: new Date().toISOString(),
          createdBy: '1',
          updatedAt: new Date().toISOString(),
          updatedBy: '1',
        },
      ];
      setProducts(sampleProducts);
      localStorage.setItem('products_v2', JSON.stringify(sampleProducts));
    }

    // Load batches
    const batchesJson = localStorage.getItem('batches_v2');
    if (batchesJson) {
      setBatches(JSON.parse(batchesJson));
    } else {
      // Initialize with sample batches
      const sampleBatches: Batch[] = [
        {
          id: 'b1',
          productId: '1',
          productName: 'Leche Entera',
          productBarcode: '7790001234567',
          expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          quantity: 24,
          createdAt: new Date().toISOString(),
          createdBy: '1',
          updatedAt: new Date().toISOString(),
          updatedBy: '1',
        },
        {
          id: 'b2',
          productId: '1',
          productName: 'Leche Entera',
          productBarcode: '7790001234567',
          expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          quantity: 36,
          createdAt: new Date().toISOString(),
          createdBy: '1',
          updatedAt: new Date().toISOString(),
          updatedBy: '1',
        },
        {
          id: 'b3',
          productId: '2',
          productName: 'Yogurt Natural',
          productBarcode: '7790002345678',
          expirationDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          quantity: 48,
          createdAt: new Date().toISOString(),
          createdBy: '1',
          updatedAt: new Date().toISOString(),
          updatedBy: '1',
        },
        {
          id: 'b4',
          productId: '3',
          productName: 'Manteca',
          productBarcode: '7790003456789',
          expirationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          quantity: 12,
          createdAt: new Date().toISOString(),
          createdBy: '1',
          updatedAt: new Date().toISOString(),
          updatedBy: '1',
        },
        {
          id: 'b5',
          productId: '2',
          productName: 'Yogurt Natural',
          productBarcode: '7790002345678',
          expirationDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          quantity: 24,
          createdAt: new Date().toISOString(),
          createdBy: '2',
          updatedAt: new Date().toISOString(),
          updatedBy: '2',
        },
      ];
      setBatches(sampleBatches);
      localStorage.setItem('batches_v2', JSON.stringify(sampleBatches));
    }

    // Load history
    const historyJson = localStorage.getItem('history_v2');
    if (historyJson) {
      setHistory(JSON.parse(historyJson));
    }

    // Load users
    const usersJson = localStorage.getItem('users');
    if (usersJson) {
      setUsers(JSON.parse(usersJson));
    }
  }, []);

  const addProduct = (
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
    userId: string,
    userName: string
  ): Product => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('products_v2', JSON.stringify(updatedProducts));

    const historyEntry: HistoryEntry = {
      id: Date.now().toString(),
      entityType: 'product',
      entityId: newProduct.id,
      entityName: newProduct.name,
      action: 'create',
      userId,
      userName,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [historyEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('history_v2', JSON.stringify(updatedHistory));

    return newProduct;
  };

  const updateProduct = (
    product: Product,
    userId: string,
    userName: string,
    changes: string
  ) => {
    const updatedProduct = {
      ...product,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    };

    const updatedProducts = products.map((p) =>
      p.id === product.id ? updatedProduct : p
    );
    setProducts(updatedProducts);
    localStorage.setItem('products_v2', JSON.stringify(updatedProducts));

    // Update product info in all batches
    const updatedBatches = batches.map((b) =>
      b.productId === product.id
        ? { ...b, productName: product.name, productBarcode: product.barcode }
        : b
    );
    setBatches(updatedBatches);
    localStorage.setItem('batches_v2', JSON.stringify(updatedBatches));

    const historyEntry: HistoryEntry = {
      id: Date.now().toString(),
      entityType: 'product',
      entityId: product.id,
      entityName: product.name,
      action: 'update',
      userId,
      userName,
      timestamp: new Date().toISOString(),
      changes,
    };

    const updatedHistory = [historyEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('history_v2', JSON.stringify(updatedHistory));
  };

  const deleteProduct = (id: string, userId: string, userName: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    // Delete all batches of this product
    const updatedBatches = batches.filter((b) => b.productId !== id);
    setBatches(updatedBatches);
    localStorage.setItem('batches_v2', JSON.stringify(updatedBatches));

    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products_v2', JSON.stringify(updatedProducts));

    const historyEntry: HistoryEntry = {
      id: Date.now().toString(),
      entityType: 'product',
      entityId: id,
      entityName: product.name,
      action: 'delete',
      userId,
      userName,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [historyEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('history_v2', JSON.stringify(updatedHistory));
  };

  const getProductByBarcode = (barcode: string): Product | undefined => {
    return products.find((p) => p.barcode === barcode);
  };

  const getBatchesByProductId = (productId: string): Batch[] => {
    return batches.filter((b) => b.productId === productId);
  };

  const addBatch = (
    batch: Omit<Batch, 'id' | 'createdAt' | 'updatedAt'>,
    userId: string,
    userName: string
  ) => {
    const newBatch: Batch = {
      ...batch,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedBatches = [...batches, newBatch];
    setBatches(updatedBatches);
    localStorage.setItem('batches_v2', JSON.stringify(updatedBatches));

    const historyEntry: HistoryEntry = {
      id: Date.now().toString(),
      entityType: 'batch',
      entityId: newBatch.id,
      entityName: `${newBatch.productName} - Lote`,
      action: 'create',
      userId,
      userName,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [historyEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('history_v2', JSON.stringify(updatedHistory));
  };

  const updateBatch = (
    batch: Batch,
    userId: string,
    userName: string,
    changes: string
  ) => {
    const updatedBatch = {
      ...batch,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    };

    const updatedBatches = batches.map((b) =>
      b.id === batch.id ? updatedBatch : b
    );
    setBatches(updatedBatches);
    localStorage.setItem('batches_v2', JSON.stringify(updatedBatches));

    const historyEntry: HistoryEntry = {
      id: Date.now().toString(),
      entityType: 'batch',
      entityId: batch.id,
      entityName: `${batch.productName} - Lote`,
      action: 'update',
      userId,
      userName,
      timestamp: new Date().toISOString(),
      changes,
    };

    const updatedHistory = [historyEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('history_v2', JSON.stringify(updatedHistory));
  };

  const deleteBatch = (id: string, userId: string, userName: string) => {
    const batch = batches.find((b) => b.id === id);
    if (!batch) return;

    const updatedBatches = batches.filter((b) => b.id !== id);
    setBatches(updatedBatches);
    localStorage.setItem('batches_v2', JSON.stringify(updatedBatches));

    const historyEntry: HistoryEntry = {
      id: Date.now().toString(),
      entityType: 'batch',
      entityId: id,
      entityName: `${batch.productName} - Lote`,
      action: 'delete',
      userId,
      userName,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [historyEntry, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('history_v2', JSON.stringify(updatedHistory));
  };

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const updateUser = (user: User) => {
    const updatedUsers = users.map((u) => (u.id === user.id ? user : u));
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    const currentUserJson = localStorage.getItem('currentUser');
    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson);
      if (currentUser.id === user.id) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
    }
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter((u) => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <DataContext.Provider
      value={{
        products,
        batches,
        history,
        users,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductByBarcode,
        getBatchesByProductId,
        addBatch,
        updateBatch,
        deleteBatch,
        addUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
