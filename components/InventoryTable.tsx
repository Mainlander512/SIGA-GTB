import React, { useState, useMemo } from 'react';
import { InventoryItem } from '../types';
import ToggleSwitch from './ToggleSwitch';
import { EditIcon } from './icons/EditIcon';

interface InventoryTableProps {
  inventory: InventoryItem[];
  onToggleStatus: (itemId: string) => void;
  onOpenEditModal: (item: InventoryItem) => void;
  onOpenDetailsModal: (item: InventoryItem) => void;
}

type SortKey = 'lastModified' | 'name' | 'stockDesc' | 'stockAsc';

const InventoryTable: React.FC<InventoryTableProps> = ({ inventory, onToggleStatus, onOpenEditModal, onOpenDetailsModal }) => {
    
    const [sortBy, setSortBy] = useState<SortKey>('lastModified');

    const sortedInventory = useMemo(() => {
        const sortableInventory = [...inventory];
        sortableInventory.sort((a, b) => {
          switch (sortBy) {
            case 'name':
              return a.name.localeCompare(b.name);
            case 'stockDesc':
              return b.currentStock - a.currentStock;
            case 'stockAsc':
              return a.currentStock - b.currentStock;
            case 'lastModified':
            default:
              return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
          }
        });
        return sortableInventory;
    }, [inventory, sortBy]);

    const formatDateTime = (isoString: string) => {
        return new Date(isoString).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    const sortOptions: { key: SortKey; label: string }[] = [
        { key: 'lastModified', label: 'Más Reciente' },
        { key: 'name', label: 'Nombre (A-Z)' },
        { key: 'stockDesc', label: 'Stock (Mayor)' },
        { key: 'stockAsc', label: 'Stock (Menor)' },
    ];


  return (
    <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-xl font-bold text-slate-200 whitespace-nowrap">
            Vista de Inventario
        </h2>
        <div className="flex-grow w-full md:w-auto">
            <div className="flex bg-slate-900/50 rounded-lg p-1 overflow-x-auto">
                {sortOptions.map(option => (
                <button
                    key={option.key}
                    onClick={() => setSortBy(option.key)}
                    className={`flex-1 md:flex-none text-xs font-bold py-2 px-3 rounded-md transition-colors whitespace-nowrap ${
                    sortBy === option.key
                        ? 'bg-brand-accent text-white'
                        : 'text-slate-400 hover:bg-slate-700/50'
                    }`}
                >
                    {option.label}
                </button>
                ))}
            </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead className="border-b border-slate-600 text-slate-400 text-sm">
            <tr>
              <th className="p-3">Nombre del Activo</th>
              <th className="p-3 text-center">Stock Actual</th>
              <th className="p-3 text-center">Estado</th>
              <th className="p-3 hidden lg:table-cell">ID del Activo</th>
              <th className="p-3 hidden xl:table-cell">Última Modificación</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedInventory.map((item) => {
              const isLowStock = item.currentStock <= item.minStock && item.status === 'active';
              const isInactive = item.status === 'inactive';

              return (
                <tr 
                    key={item.id} 
                    className={`border-b border-slate-700 transition-colors cursor-pointer ${isInactive ? 'bg-slate-800/50 text-slate-500' : 'hover:bg-slate-700/50'}`}
                    onClick={() => onOpenDetailsModal(item)}
                >
                  <td className={`p-3 font-medium ${isInactive ? 'text-slate-500' : 'text-white'}`}>
                    <span className={isInactive ? 'line-through' : ''} title={item.description || item.name}>
                      {item.name}
                    </span>
                    <div className="text-xs lg:hidden">ID: {item.id}</div>
                  </td>
                  <td className={`p-3 text-center font-bold text-lg ${isLowStock ? 'text-red-400 animate-pulse' : isInactive ? 'text-slate-600' : 'text-green-400'}`}>
                    {item.currentStock}
                    <span className={`text-xs ml-1 ${isInactive ? 'text-slate-600' : 'text-slate-400'}`}>{item.unitOfMeasure}</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isInactive ? 'bg-slate-700 text-slate-300' : 'bg-green-500/20 text-green-300'}`}>
                        {isInactive ? 'Inactivo' : 'Activo'}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-xs hidden lg:table-cell">{item.id}</td>
                  <td className="p-3 text-sm hidden xl:table-cell">{formatDateTime(item.lastModified)}</td>
                  <td className="p-3 text-center">
                     <div className="flex items-center justify-center gap-4">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onOpenEditModal(item); }} 
                            className="text-slate-400 hover:text-brand-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={`Editar ${item.name}`}
                            title={`Editar ${item.name}`}
                            disabled={isInactive}
                        >
                            <EditIcon />
                        </button>
                        <div onClick={(e) => e.stopPropagation()}>
                            <ToggleSwitch 
                                checked={!isInactive} 
                                onChange={() => onToggleStatus(item.id)}
                                ariaLabel={`Cambiar estado de ${item.name}`}
                            />
                        </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {inventory.length === 0 && <p className="text-center text-slate-500 py-8">No se encontraron artículos con los filtros actuales.</p>}
      </div>
    </div>
  );
};

export default InventoryTable;