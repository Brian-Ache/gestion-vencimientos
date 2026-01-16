import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { getDaysUntilExpiration, getBatchStatus } from '../utils/productStatus';
import { AlertTriangle, Package, Layers } from 'lucide-react';

export const WarningProducts: React.FC = () => {
  const { batches } = useData();

  const warningBatches = useMemo(() => {
    return batches
      .filter((b) => getBatchStatus(b.expirationDate) === 'warning')
      .sort((a, b) => {
        const daysA = getDaysUntilExpiration(a.expirationDate);
        const daysB = getDaysUntilExpiration(b.expirationDate);
        return daysA - daysB;
      });
  }, [batches]);

  const totalQuantity = useMemo(() => {
    return warningBatches.reduce((sum, batch) => sum + batch.quantity, 0);
  }, [warningBatches]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-yellow-100 p-3 rounded-xl">
          <AlertTriangle className="w-8 h-8 text-yellow-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Lotes Próximos a Vencer</h2>
          <p className="text-gray-600">
            {warningBatches.length} lotes ({totalQuantity} unidades) vencen en los próximos 7-30 días
          </p>
        </div>
      </div>

      {warningBatches.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No hay lotes próximos a vencer</p>
          <p className="text-gray-400 text-sm mt-2">
            Los lotes que venzan en 7-30 días aparecerán aquí
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {warningBatches.map((batch) => {
            const days = getDaysUntilExpiration(batch.expirationDate);

            return (
              <div
                key={batch.id}
                className="bg-white rounded-xl border-2 border-yellow-200 p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs font-medium text-yellow-700">LOTE</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{batch.productName}</h3>
                    <p className="text-sm text-gray-600">{batch.productBarcode}</p>
                  </div>
                  <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {days} días
                  </div>
                </div>

                <div className="space-y-3 bg-yellow-50 p-4 rounded-lg">
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

                  <div className="pt-3 border-t border-yellow-200">
                    <div className="flex items-center gap-2 text-yellow-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Vence en {days} días
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  <p>Lote creado: {new Date(batch.createdAt).toLocaleDateString('es-ES')}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {warningBatches.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900 mb-1">Recomendación</h3>
              <p className="text-sm text-yellow-700">
                Estos lotes están próximos a vencer. Considere priorizar su venta, realizar promociones o contactar a los clientes para reducir pérdidas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
