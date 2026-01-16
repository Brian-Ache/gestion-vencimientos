import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { getBatchStatus, getDaysUntilExpiration, getStatusColor, getStatusLabel } from '../utils/productStatus';
import { Search, Plus, Edit, Trash2, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { ProductForm } from './ProductForm';
import { BatchForm } from './BatchForm';
import type{ Product } from '../types';

export const ProductList: React.FC = () => {
  const { products, batches, deleteProduct, getBatchesByProductId } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [showProductForm, setShowProductForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm);

      return matchesSearch;
    });
  }, [products, searchTerm]);

  const toggleProduct = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = (product: Product) => {
    const productBatches = getBatchesByProductId(product.id);
    if (productBatches.length > 0) {
      if (!window.confirm(`Este producto tiene ${productBatches.length} lote(s). ¿Está seguro que desea eliminarlo junto con todos sus lotes?`)) {
        return;
      }
    } else {
      if (!window.confirm(`¿Está seguro que desea eliminar "${product.name}"?`)) {
        return;
      }
    }
    deleteProduct(product.id, user!.id, user!.name);
  };

  const handleAddBatch = (productId: string) => {
    setSelectedProductId(productId);
    setShowBatchForm(true);
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleCloseBatchForm = () => {
    setShowBatchForm(false);
    setSelectedProductId(null);
  };

  if (showProductForm) {
    return <ProductForm product={editingProduct} onClose={handleCloseProductForm} />;
  }

  if (showBatchForm && selectedProductId) {
    return <BatchForm productId={selectedProductId} onClose={handleCloseBatchForm} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Productos y Lotes</h2>
          <p className="text-gray-600">{filteredProducts.length} productos • {batches.length} lotes</p>
        </div>
        <button
          onClick={() => setShowProductForm(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre o código de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {filteredProducts.map((product) => {
          const productBatches = getBatchesByProductId(product.id);
          const isExpanded = expandedProducts.has(product.id);
          const totalQuantity = productBatches.reduce((sum, b) => sum + b.quantity, 0);
          
          // Get worst status from batches
          const worstStatus = productBatches.reduce((worst, batch) => {
            const status = getBatchStatus(batch.expirationDate);
            if (status === 'expired') return 'expired';
            if (status === 'warning' && worst !== 'expired') return 'warning';
            return worst;
          }, 'valid' as 'valid' | 'warning' | 'expired');

          return (
            <div
              key={product.id}
              className={`bg-white rounded-xl border-2 shadow-sm transition ${
                productBatches.length === 0 ? 'border-gray-200' : getStatusColor(worstStatus)
              }`}
            >
              {/* Product Header */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <button
                    onClick={() => toggleProduct(product.id)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <Layers className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{product.barcode}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                      title="Editar producto"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Total Lotes</p>
                    <p className="text-lg font-semibold text-gray-900">{productBatches.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cantidad Total</p>
                    <p className="text-lg font-semibold text-gray-900">{totalQuantity} uds</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estado</p>
                    {productBatches.length === 0 ? (
                      <p className="text-sm text-gray-500 mt-1">Sin lotes</p>
                    ) : (
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        worstStatus === 'valid'
                          ? 'bg-green-500 text-white'
                          : worstStatus === 'warning'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {getStatusLabel(worstStatus)}
                      </span>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => handleAddBatch(product.id)}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Nuevo Lote
                    </button>
                  </div>
                </div>
              </div>

              {/* Batches List */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Lotes del Producto</h4>
                    {productBatches.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No hay lotes registrados para este producto
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {productBatches
                          .sort((a, b) => getDaysUntilExpiration(a.expirationDate) - getDaysUntilExpiration(b.expirationDate))
                          .map((batch) => {
                            const status = getBatchStatus(batch.expirationDate);
                            const days = getDaysUntilExpiration(batch.expirationDate);

                            return (
                              <div
                                key={batch.id}
                                className={`bg-white rounded-lg border-2 p-4 ${getStatusColor(status)}`}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    status === 'valid'
                                      ? 'bg-green-500 text-white'
                                      : status === 'warning'
                                      ? 'bg-yellow-500 text-white'
                                      : 'bg-red-500 text-white'
                                  }`}>
                                    {getStatusLabel(status)}
                                  </span>
                                  <span className="text-sm font-semibold text-gray-900">
                                    {batch.quantity} uds
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  <div>
                                    <p className="text-xs text-gray-600">Vencimiento</p>
                                    <p className="text-sm font-medium text-gray-900">
                                      {new Date(batch.expirationDate).toLocaleDateString('es-ES')}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-gray-600">Estado</p>
                                    <p className={`text-sm font-medium ${
                                      days < 0
                                        ? 'text-red-600'
                                        : days <= 7
                                        ? 'text-red-600'
                                        : days <= 30
                                        ? 'text-yellow-600'
                                        : 'text-green-600'
                                    }`}>
                                      {days < 0
                                        ? `Vencido hace ${Math.abs(days)}d`
                                        : days === 0
                                        ? 'Vence hoy'
                                        : `${days} días`}
                                    </p>
                                  </div>

                                  <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
                                    Creado: {new Date(batch.createdAt).toLocaleDateString('es-ES')}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No se encontraron productos</p>
        </div>
      )}
    </div>
  );
};
