import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { getBatchStatus, getDaysUntilExpiration } from '../utils/productStatus';
import { Package, AlertTriangle, XCircle, CheckCircle, TrendingUp, Layers } from 'lucide-react';
import type { Batch } from '../types';

export const Dashboard: React.FC = () => {
  const { products, batches, history } = useData();

  const stats = useMemo(() => {
    const validBatches = batches.filter((b) => getBatchStatus(b.expirationDate) === 'valid');
    const warningBatches = batches.filter((b) => getBatchStatus(b.expirationDate) === 'warning');
    const expiredBatches = batches.filter((b) => getBatchStatus(b.expirationDate) === 'expired');

    return {
      totalProducts: products.length,
      totalBatches: batches.length,
      validBatches: validBatches.length,
      warningBatches: warningBatches.length,
      expiredBatches: expiredBatches.length,
      totalQuantity: batches.reduce((sum, b) => sum + b.quantity, 0),
    };
  }, [products, batches]);

  const recentBatches = useMemo(() => {
    return [...batches]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [batches]);

  const criticalBatches = useMemo(() => {
    return [...batches]
      .filter((b) => {
        const days = getDaysUntilExpiration(b.expirationDate);
        return days < 7;
      })
      .sort((a, b) => {
        const daysA = getDaysUntilExpiration(a.expirationDate);
        const daysB = getDaysUntilExpiration(b.expirationDate);
        return daysA - daysB;
      })
      .slice(0, 5);
  }, [batches]);

  const getStatusColor = (batch: Batch) => {
    const status = getBatchStatus(batch.expirationDate);
    switch (status) {
      case 'valid':
        return 'border-l-green-500 bg-green-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'expired':
        return 'border-l-red-500 bg-red-50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Resumen general del inventario por lotes</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalProducts}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Productos</h3>
          <p className="text-xs text-gray-500 mt-1">Registrados</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-blue-600">{stats.totalBatches}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total Lotes</h3>
          <p className="text-xs text-blue-600 mt-1">{stats.totalQuantity} unidades</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{stats.validBatches}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Lotes Vigentes</h3>
          <p className="text-xs text-green-600 mt-1">Más de 30 días</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-yellow-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-yellow-600">{stats.warningBatches}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Próximos a Vencer</h3>
          <p className="text-xs text-yellow-600 mt-1">7 a 30 días</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-red-600">{stats.expiredBatches}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Lotes Vencidos</h3>
          <p className="text-xs text-red-600 mt-1">Requiere atención</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Batches */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Lotes Críticos</h3>
            </div>
          </div>
          <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
            {criticalBatches.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay lotes críticos</p>
            ) : (
              criticalBatches.map((batch) => {
                const days = getDaysUntilExpiration(batch.expirationDate);
                return (
                  <div
                    key={batch.id}
                    className={`p-4 rounded-lg border-l-4 ${getStatusColor(batch)}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-medium text-gray-900">{batch.productName}</h4>
                        <p className="text-xs text-gray-600 mt-1">{batch.productBarcode}</p>
                      </div>
                      <span className="text-xs font-medium text-gray-500 whitespace-nowrap ml-2">
                        {batch.quantity} uds
                      </span>
                    </div>
                    <p className="text-xs font-medium mt-2">
                      {days < 0 ? (
                        <span className="text-red-600">Vencido hace {Math.abs(days)} días</span>
                      ) : days === 0 ? (
                        <span className="text-red-600">Vence hoy</span>
                      ) : (
                        <span className="text-orange-600">Vence en {days} días</span>
                      )}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Batches */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Lotes Recientes</h3>
            </div>
          </div>
          <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
            {recentBatches.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay lotes registrados</p>
            ) : (
              recentBatches.map((batch) => {
                const days = getDaysUntilExpiration(batch.expirationDate);
                return (
                  <div
                    key={batch.id}
                    className={`p-4 rounded-lg border-l-4 ${getStatusColor(batch)}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-medium text-gray-900">{batch.productName}</h4>
                        <p className="text-xs text-gray-600 mt-1">{batch.productBarcode}</p>
                      </div>
                      <span className="text-xs font-medium text-gray-500 whitespace-nowrap ml-2">
                        {batch.quantity} uds
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Vence: {new Date(batch.expirationDate).toLocaleDateString('es-ES')} ({days > 0 ? `${days} días` : 'vencido'})
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Actividad Reciente</h3>
        </div>
        <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
          {history.slice(0, 10).map((entry) => (
            <div key={entry.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  entry.action === 'create'
                    ? 'bg-green-100 text-green-600'
                    : entry.action === 'update'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {entry.entityType === 'batch' ? (
                  <Layers className="w-4 h-4" />
                ) : (
                  <Package className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{entry.userName}</span>{' '}
                  {entry.action === 'create' && 'creó'}
                  {entry.action === 'update' && 'actualizó'}
                  {entry.action === 'delete' && 'eliminó'}{' '}
                  <span className="font-medium">{entry.entityName}</span>
                </p>
                {entry.changes && (
                  <p className="text-xs text-gray-500 mt-1">{entry.changes}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(entry.timestamp).toLocaleString('es-ES')}
                </p>
              </div>
            </div>
          ))}
          {history.length === 0 && (
            <p className="text-gray-500 text-center py-8">No hay actividad reciente</p>
          )}
        </div>
      </div>
    </div>
  );
};
