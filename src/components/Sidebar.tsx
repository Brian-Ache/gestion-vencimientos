import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  ScanBarcode,
  AlertTriangle,
  XCircle,
  Users,
  History,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isMobileMenuOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isMobileMenuOpen,
}) => {
  const { isAdmin } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'scanner', label: 'Escanear Código', icon: ScanBarcode },
    { id: 'warnings', label: 'Próximos a Vencer', icon: AlertTriangle },
    { id: 'expired', label: 'Vencidos', icon: XCircle },
    { id: 'history', label: 'Historial', icon: History },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'users', label: 'Gestión de Usuarios', icon: Users });
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => onViewChange(currentView)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 
          transition-transform duration-300 z-30
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <nav className="p-4 space-y-2 overflow-y-auto h-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition
                  ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
