import React from 'react';
import { InventoryItem } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { InfoIcon } from './icons/InfoIcon';

interface AssetDetailsModalProps {
  item: InventoryItem;
  onClose: () => void;
}

const AssetDetailsModal: React.FC<AssetDetailsModalProps> = ({ item, onClose }) => {
  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className="text-md text-slate-200">{value}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-lg relative border border-slate-700 animate-fade-in-down">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white">
          <CloseIcon />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-primary/50 text-brand-accent mb-3">
                <InfoIcon />
            </div>
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p className="text-sm text-slate-400 font-mono">{item.id}</p>
        </div>

        <div className="space-y-4">
            {item.description && (
                <div className="bg-slate-900/50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-slate-400">Descripción</p>
                    <p className="text-md text-slate-200">{item.description}</p>
                </div>
            )}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-700 pt-4">
                <DetailItem label="Categoría" value={item.category} />
                <DetailItem label="Estado" value={
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${item.status === 'inactive' ? 'bg-slate-700 text-slate-300' : 'bg-green-500/20 text-green-300'}`}>
                        {item.status === 'inactive' ? 'Inactivo' : 'Activo'}
                    </span>
                } />
                <DetailItem label="Stock Actual" value={`${item.currentStock} ${item.unitOfMeasure}`} />
                <DetailItem label="Stock Mínimo" value={`${item.minStock} ${item.unitOfMeasure}`} />
                <DetailItem label="Email del Encargado" value={item.managerEmail} />
                <DetailItem label="Última Modificación" value={formatDateTime(item.lastModified)} />
            </div>
        </div>
        
        <button
            onClick={onClose}
            className="w-full font-bold text-white py-3 px-4 rounded-lg transition-colors shadow-lg mt-8 bg-slate-600 hover:bg-slate-700"
        >
            Cerrar
        </button>
      </div>
    </div>
  );
};

export default AssetDetailsModal;