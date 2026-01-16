import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, isMobileMenuOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
              Control de Vencimientos
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role === 'admin' ? 'Administrador' : 'Empleado'}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
