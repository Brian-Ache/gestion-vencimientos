export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'employee';
  name: string;
  email: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Batch {
  id: string;
  productId: string;
  productName: string;
  productBarcode: string;
  expirationDate: string;
  quantity: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface HistoryEntry {
  id: string;
  entityType: 'product' | 'batch';
  entityId: string;
  entityName: string;
  action: 'create' | 'update' | 'delete';
  userId: string;
  userName: string;
  timestamp: string;
  changes?: string;
}

export type BatchStatus = 'valid' | 'warning' | 'expired';
