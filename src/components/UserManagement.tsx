import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import type{ User } from '../types';
import { Users, Plus, Edit, Trash2, Shield, User as UserIcon, X, Save } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useData();
  const { user: currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'employee' as 'admin' | 'employee',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.name || !formData.email) {
      alert('Por favor complete todos los campos');
      return;
    }

    if (editingUser) {
      updateUser({
        ...editingUser,
        ...formData,
      });
    } else {
      addUser(formData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      name: '',
      email: '',
      role: 'employee',
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setShowForm(true);
  };

  const handleDelete = (user: User) => {
    if (user.id === currentUser?.id) {
      alert('No puede eliminar su propio usuario');
      return;
    }

    if (window.confirm(`¿Está seguro que desea eliminar al usuario "${user.name}"?`)) {
      deleteUser(user.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-xl">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Gestión de Usuarios</h2>
            <p className="text-gray-600">{users.length} usuarios registrados</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          Nuevo Usuario
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario *
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Rol *
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'employee' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white"
                  required
                >
                  <option value="employee">Empleado</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Save className="w-5 h-5" />
                {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className={`bg-white rounded-xl border-2 p-6 shadow-sm transition hover:shadow-md ${
              user.id === currentUser?.id ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${
                  user.role === 'admin' ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  {user.role === 'admin' ? (
                    <Shield className="w-6 h-6 text-purple-600" />
                  ) : (
                    <UserIcon className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  {user.id === currentUser?.id && (
                    <span className="text-xs text-indigo-600 font-medium">(Tú)</span>
                  )}
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.role === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {user.role === 'admin' ? 'Admin' : 'Empleado'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Usuario:</span>
                <span>{user.username}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Email:</span>
                <span className="truncate">{user.email}</span>
              </div>
              <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                Registrado: {new Date(user.createdAt).toLocaleDateString('es-ES')}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(user)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => handleDelete(user)}
                disabled={user.id === currentUser?.id}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition text-sm font-medium ${
                  user.id === currentUser?.id
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
