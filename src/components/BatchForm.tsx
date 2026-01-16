import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import type { Batch } from '../types';
import { X, Save, Trash2 } from 'lucide-react';

interface BatchFormProps {
  productId: string;
  batch?: Batch | null;
  onClose: () => void;
}

export const BatchForm: React.FC<BatchFormProps> = ({ productId, batch, onClose }) => {
  const { products, addBatch, updateBatch, deleteBatch } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    expirationDate: '',
    quantity: 1,
  });

  const product = products.find((p) => p.id === productId);

  useEffect(() => {
    if (batch) {
      setFormData({
        expirationDate: batch.expirationDate,
        quantity: batch.quantity,
      });
    }
  }, [batch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.expirationDate || formData.quantity < 1) {
      alert('Por favor complete todos los campos correctamente');
      return;
    }

    if (!product) {
      alert('Producto no encontrado');
      return;
    }

    if (batch) {
      // Update existing batch
      const oldBatch = batch;
      const changes: string[] = [];

      if (oldBatch.quantity !== formData.quantity) changes.push(`cantidad: ${oldBatch.quantity} → ${formData.quantity}`);
      if (oldBatch.expirationDate !== formData.expirationDate) {
        changes.push(
          `vencimiento: ${new Date(oldBatch.expirationDate).toLocaleDateString('es-ES')} → ${new Date(
            formData.expirationDate
          ).toLocaleDateString('es-ES')}`
        );
      }

      updateBatch(
        {
          ...batch,
          ...formData,
        },
        user!.id,
        user!.name,
        changes.join(', ')
      );
    } else {
      // Create new batch
      addBatch(
        {
          productId: product.id,
          productName: product.name,
          productBarcode: product.barcode,
          expirationDate: formData.expirationDate,
          quantity: formData.quantity,
          createdBy: user!.id,
          updatedBy: user!.id,
        },
        user!.id,
        user!.name
      );
    }

    onClose();
  };

  const handleDelete = () => {
    if (!batch) return;
    if (window.confirm('¿Está seguro que desea eliminar este lote?')) {
      deleteBatch(batch.id, user!.id, user!.name);
      onClose();
    }
  };

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-700">Producto no encontrado</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {batch ? 'Editar Lote' : 'Nuevo Lote'}
          </h2>
          <p className="text-gray-600">
            Producto: <span className="font-medium">{product.name}</span>
          </p>
          <p className="text-sm text-gray-500">Código: {product.barcode}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Vencimiento *
              </label>
              <input
                id="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad (unidades) *
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700">
              <strong>Importante:</strong> Cada lote representa una cantidad específica del producto con su fecha de vencimiento. 
              Puede tener múltiples lotes del mismo producto con diferentes fechas.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              <Save className="w-5 h-5" />
              {batch ? 'Guardar Cambios' : 'Crear Lote'}
            </button>
          </div>
        </div>
      </form>

      {batch && (
        <>
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Información del lote</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Creado: {new Date(batch.createdAt).toLocaleString('es-ES')}</p>
              <p>Última modificación: {new Date(batch.updatedAt).toLocaleString('es-ES')}</p>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition font-medium"
          >
            <Trash2 className="w-5 h-5" />
            Eliminar Lote
          </button>
        </>
      )}
    </div>
  );
};
