import type { BatchStatus } from '../types';

export const getBatchStatus = (expirationDate: string): BatchStatus => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expDate = new Date(expirationDate);
  expDate.setHours(0, 0, 0, 0);
  
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'expired'; // Vencido
  } else if (diffDays <= 7) {
    return 'expired'; // Muy próximo a vencer (rojo)
  } else if (diffDays <= 30) {
    return 'warning'; // Próximo a vencer (amarillo)
  } else {
    return 'valid'; // Vigente (verde)
  }
};

export const getDaysUntilExpiration = (expirationDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expDate = new Date(expirationDate);
  expDate.setHours(0, 0, 0, 0);
  
  const diffTime = expDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getStatusColor = (status: BatchStatus): string => {
  switch (status) {
    case 'valid':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'warning':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'expired':
      return 'text-red-600 bg-red-50 border-red-200';
  }
};

export const getStatusBadgeColor = (status: BatchStatus): string => {
  switch (status) {
    case 'valid':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'expired':
      return 'bg-red-500';
  }
};

export const getStatusLabel = (status: BatchStatus): string => {
  switch (status) {
    case 'valid':
      return 'Vigente';
    case 'warning':
      return 'Próximo a vencer';
    case 'expired':
      return 'Vencido';
  }
};
