import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProductList } from './components/ProductList';
import { BarcodeScanner } from './components/BarcodeScanner';
import { WarningProducts } from './components/WarningProducts';
import { ExpiredProducts } from './components/ExpiredProducts';
import { UserManagement } from './components/UserManagement';
import { ProductHistory } from './components/ProductHistory';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!user) {
    return <LoginPage />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductList />;
      case 'scanner':
        return <BarcodeScanner />;
      case 'warnings':
        return <WarningProducts />;
      case 'expired':
        return <ExpiredProducts />;
      case 'history':
        return <ProductHistory />;
      case 'users':
        return <UserManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={handleMenuToggle} isMobileMenuOpen={isMobileMenuOpen} />
      <div className="flex">
        <Sidebar
          currentView={currentView}
          onViewChange={handleViewChange}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
