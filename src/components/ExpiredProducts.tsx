import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { getDaysUntilExpiration, getBatchStatus } from '../utils/productStatus';
import { XCircle, Package, Trash2, Layers } from 'lucide-react';

export const ExpiredProducts: React.FC = () => {
  const { batches, deleteBatch } = useData();
  const { user } = useAuth();

  const expiredBatches = useMemo(() => {
    return batches
      .filter((b) => getBatchStatus(b.expirationDate) === 'expired')
      .sort((a, b) => {
        const daysA = getDaysUntilExpiration(a.expirationDate);
        const daysB = getDaysUntilExpiration(b.expirationDate);
        return daysA - daysB;
      });
  }, [batches]);

  const totalQuantity = useMemo(() => {
    return expiredBatches.reduce((sum, batch) => sum + batch.quantity, 0);
  }, [expiredBatches]);

  const handleDelete = (batchId: string, productName: string) => {
    if (window.confirm(`¿Está seguro que desea eliminar este lote de "${productName}"?`)) {
      deleteBatch(batchId, user!.id, user!.name);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-red-100 p-3 rounded-xl">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Lotes Vencidos</h2>
          <p className="text-gray-600">
            {expiredBatches.length} lotes ({totalQuantity} unidades) vencidos o con menos de 7 días
          </p>
        </div>
      </div>

      {expiredBatches.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900 mb-1">Atención Requerida</h3>
              <p className="text-sm text-red-700">
                Estos lotes deben ser retirados inmediatamente. Verifique las fechas y elimine los lotes vencidos para mantener la integridad del inventario.
              </p>
            </div>
          </div>
        </div>
      )}

      {expiredBatches.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No hay lotes vencidos</p>
          <p className="text-gray-400 text-sm mt-2">
            Los lotes vencidos o con menos de 7 días de vigencia aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expiredBatches.map((batch) => {
            const days = getDaysUntilExpiration(batch.expirationDate);
            const isExpired = days < 0;

            return (
              <div
                key={batch.id}
                className="bg-white rounded-xl border-2 border-red-200 p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-medium text-red-700">LOTE</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{batch.productName}</h3>
                    <p className="text-sm text-gray-600">{batch.productBarcode}</p>
                  </div>
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {isExpired ? 'VENCIDO' : `${days}d`}
                  </div>
                </div>

                <div className="space-y-3 bg-red-50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cantidad:</span>
                    <span className="font-medium text-gray-900">{batch.quantity} unidades</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vencimiento:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(batch.expirationDate).toLocaleDateString('es-ES')}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-red-200">
                    <div className="flex items-center gap-2 text-red-700">
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {isExpired
                          ? `Vencido hace ${Math.abs(days)} días`
                          : days === 0
                          ? 'Vence hoy'
                          : `Vence en ${days} días`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleDelete(batch.id, batch.productName)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar Lote
                  </button>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  <p>Lote creado: {new Date(batch.createdAt).toLocaleDateString('es-ES')}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
