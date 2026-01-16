import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import type { Product } from '../types';
import { X, Save } from 'lucide-react';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  initialBarcode?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, initialBarcode }) => {
  const { addProduct, updateProduct } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        barcode: product.barcode,
      });
    } else if (initialBarcode) {
      setFormData((prev) => ({ ...prev, barcode: initialBarcode }));
    }
  }, [product, initialBarcode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.barcode) {
      alert('Por favor complete todos los campos');
      return;
    }

    if (product) {
      // Update existing product
      const oldProduct = product;
      const changes: string[] = [];

      if (oldProduct.name !== formData.name) changes.push(`nombre: "${oldProduct.name}" → "${formData.name}"`);
      if (oldProduct.barcode !== formData.barcode) changes.push(`código: "${oldProduct.barcode}" → "${formData.barcode}"`);

      updateProduct(
        {
          ...product,
          ...formData,
        },
        user!.id,
        user!.name,
        changes.join(', ')
      );
    } else {
      // Create new product
      addProduct(
        {
          ...formData,
          createdBy: user!.id,
          updatedBy: user!.id,
        },
        user!.id,
        user!.name
      );
    }

    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <p className="text-gray-600">
            {product ? 'Modifique los datos del producto' : 'Registre un nuevo producto base'}
          </p>
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
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Ej: Leche Entera"
              required
            />
          </div>

          <div>
            <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-2">
              Código de Barras *
            </label>
            <input
              id="barcode"
              type="text"
              value={formData.barcode}
              onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Ej: 7790001234567"
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Después de crear el producto, podrá agregar lotes con fechas de vencimiento y cantidades específicas.
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
              {product ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </div>
      </form>

      {product && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Información de registro</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Creado: {new Date(product.createdAt).toLocaleString('es-ES')}</p>
            <p>Última modificación: {new Date(product.updatedAt).toLocaleString('es-ES')}</p>
          </div>
        </div>
      )}
    </div>
  );
};
