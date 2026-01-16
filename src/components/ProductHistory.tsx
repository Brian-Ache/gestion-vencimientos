import React, { useMemo, useState } from "react";
import { useData } from "../contexts/DataContext";
import {
  History,
  Plus,
  Edit,
  Trash2,
  Filter,
  Package,
  Layers,
} from "lucide-react";

export const ProductHistory: React.FC = () => {
  const { history, users } = useData();
  const [actionFilter, setActionFilter] = useState<
    "all" | "create" | "update" | "delete"
  >("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState<
    "all" | "product" | "batch"
  >("all");

  const filteredHistory = useMemo(() => {
    return history.filter((entry) => {
      const matchesAction =
        actionFilter === "all" || entry.action === actionFilter;
      const matchesUser =
        userFilter === "all" || entry.userId === userFilter;
      const matchesEntityType =
        entityTypeFilter === "all" ||
        entry.entityType === entityTypeFilter;
      return matchesAction && matchesUser && matchesEntityType;
    });
  }, [history, actionFilter, userFilter, entityTypeFilter]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <Plus className="w-4 h-4" />;
      case "update":
        return <Edit className="w-4 h-4" />;
      case "delete":
        return <Trash2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-green-100 text-green-700 border-green-200";
      case "update":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "delete":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "create":
        return "Creación";
      case "update":
        return "Actualización";
      case "delete":
        return "Eliminación";
      default:
        return action;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-indigo-100 p-3 rounded-xl">
          <History className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Historial de Modificaciones
          </h2>
          <p className="text-gray-600">
            {filteredHistory.length} actividades registradas
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="entityTypeFilter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tipo de Entidad
            </label>
            <select
              id="entityTypeFilter"
              value={entityTypeFilter}
              onChange={(e) =>
                setEntityTypeFilter(e.target.value as any)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white"
            >
              <option value="all">Todos</option>
              <option value="product">Productos</option>
              <option value="batch">Lotes</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="actionFilter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tipo de Acción
            </label>
            <select
              id="actionFilter"
              value={actionFilter}
              onChange={(e) =>
                setActionFilter(e.target.value as any)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white"
            >
              <option value="all">Todas las acciones</option>
              <option value="create">Creaciones</option>
              <option value="update">Actualizaciones</option>
              <option value="delete">Eliminaciones</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="userFilter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Usuario
            </label>
            <select
              id="userFilter"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white"
            >
              <option value="all">Todos los usuarios</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="max-h-[600px] overflow-y-auto">
          {filteredHistory.length === 0 ? (
            <div className="p-12 text-center">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                No hay actividad registrada
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-lg border ${getActionColor(entry.action)}`}
                    >
                      {entry.entityType === "batch" ? (
                        <Layers className="w-4 h-4" />
                      ) : (
                        <Package className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">
                              {getActionLabel(entry.action)} -{" "}
                              {entry.entityName}
                            </h4>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                entry.entityType === "batch"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {entry.entityType === "batch"
                                ? "Lote"
                                : "Producto"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Por{" "}
                            <span className="font-medium">
                              {entry.userName}
                            </span>
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getActionColor(entry.action)}`}
                        >
                          {getActionLabel(entry.action)}
                        </span>
                      </div>

                      {entry.changes && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-2">
                          <p className="text-xs font-medium text-gray-700 mb-1">
                            Cambios realizados:
                          </p>
                          <p className="text-xs text-gray-600">
                            {entry.changes}
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-gray-500">
                        {new Date(
                          entry.timestamp,
                        ).toLocaleString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};