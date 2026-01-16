import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Camera, X, Keyboard, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { ProductForm } from './ProductForm';
import { BatchForm } from './BatchForm';
import type{ Product } from '../types';

export const BarcodeScanner: React.FC = () => {
  const { getProductByBarcode, getBatchesByProductId } = useData();
  const [isScanning, setIsScanning] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [newProductBarcode, setNewProductBarcode] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      setIsScanning(true);
      setMessage(null);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setMessage({
        type: 'error',
        text: 'No se pudo acceder a la cámara. Use el modo manual como alternativa.',
      });
      setManualMode(true);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualBarcode.trim()) {
      setMessage({ type: 'error', text: 'Ingrese un código de barras' });
      return;
    }

    const product = getProductByBarcode(manualBarcode);
    if (product) {
      setScannedProduct(product);
      setMessage({ type: 'success', text: 'Producto encontrado' });
    } else {
      setNewProductBarcode(manualBarcode);
      setShowProductForm(true);
      setMessage({ type: 'error', text: 'Producto no encontrado. Crear nuevo.' });
    }
  };

  const simulateScan = () => {
    // Simulate scanning for demo purposes
    const testBarcode = '7790001234567';
    const product = getProductByBarcode(testBarcode);
    
    if (product) {
      setScannedProduct(product);
      setMessage({ type: 'success', text: 'Código escaneado correctamente' });
      stopCamera();
    } else {
      setNewProductBarcode(testBarcode);
      setShowProductForm(true);
      setMessage({ type: 'error', text: 'Producto no encontrado. Crear nuevo.' });
      stopCamera();
    }
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setNewProductBarcode('');
    setScannedProduct(null);
    setManualBarcode('');
    setMessage(null);
  };

  const handleCloseBatchForm = () => {
    setShowBatchForm(false);
    setScannedProduct(null);
    setManualBarcode('');
    setMessage(null);
  };

  const handleNewSearch = () => {
    setScannedProduct(null);
    setManualBarcode('');
    setMessage(null);
  };

  if (showProductForm) {
    return <ProductForm initialBarcode={newProductBarcode} onClose={handleCloseProductForm} />;
  }

  if (showBatchForm && scannedProduct) {
    return <BatchForm productId={scannedProduct.id} onClose={handleCloseBatchForm} />;
  }

  if (scannedProduct) {
    const productBatches = getBatchesByProductId(scannedProduct.id);
    const totalQuantity = productBatches.reduce((sum, b) => sum + b.quantity, 0);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Producto Encontrado</h2>
            <p className="text-gray-600">Detalles y lotes del producto escaneado</p>
          </div>
          <button
            onClick={handleNewSearch}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Nueva Búsqueda
          </button>
        </div>

        <div className="bg-white rounded-xl border-2 border-green-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{scannedProduct.name}</h3>
              <p className="text-sm text-gray-600">{scannedProduct.barcode}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total de Lotes</p>
              <p className="text-2xl font-bold text-gray-900">{productBatches.length}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Cantidad Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalQuantity} uds</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <button
                onClick={() => setShowBatchForm(true)}
                className="w-full h-full flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                <Plus className="w-5 h-5" />
                Agregar Lote
              </button>
            </div>
          </div>

          {productBatches.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Lotes Existentes</h4>
              <div className="space-y-2">
                {productBatches
                  .sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime())
                  .map((batch) => {
                    const daysUntilExpiration = Math.ceil(
                      (new Date(batch.expirationDate).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    const isExpired = daysUntilExpiration < 0;
                    const isWarning = daysUntilExpiration >= 0 && daysUntilExpiration <= 30;

                    return (
                      <div
                        key={batch.id}
                        className={`p-3 rounded-lg border ${
                          isExpired
                            ? 'border-red-200 bg-red-50'
                            : isWarning
                            ? 'border-yellow-200 bg-yellow-50'
                            : 'border-green-200 bg-green-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Vence: {new Date(batch.expirationDate).toLocaleDateString('es-ES')}
                            </p>
                            <p className="text-xs text-gray-600">
                              {isExpired
                                ? `Vencido hace ${Math.abs(daysUntilExpiration)} días`
                                : `${daysUntilExpiration} días restantes`}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {batch.quantity} uds
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {productBatches.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-700">
                Este producto no tiene lotes registrados. Agregue un lote para comenzar a gestionar el inventario.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Escaneo de Código de Barras</h2>
        <p className="text-gray-600">
          Use la cámara para escanear o ingrese el código manualmente
        </p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-3 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Camera Mode */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Camera className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Escaneo con Cámara</h3>
          </div>

          {!isScanning ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Active la cámara para escanear códigos de barras
              </p>
              <button
                onClick={startCamera}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                <Camera className="w-5 h-5" />
                Activar Cámara
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-white w-64 h-32 rounded-lg opacity-50"></div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={simulateScan}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                >
                  Simular Escaneo (Demo)
                </button>
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Posicione el código de barras dentro del marco
              </p>
            </div>
          )}
        </div>

        {/* Manual Mode */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <Keyboard className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Ingreso Manual</h3>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <p className="text-sm text-gray-600">
              Ingrese el código de barras manualmente
            </p>
            
            <input
              type="text"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              placeholder="Ej: 7790001234567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Buscar Producto
            </button>
          </form>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Códigos de prueba:</strong>
              <br />
              7790001234567 - Leche Entera
              <br />
              7790002345678 - Yogurt Natural
              <br />
              9999999999999 - Producto inexistente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};