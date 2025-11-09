import React from 'react';
import { ModalType } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';
import { DocumentAddIcon } from './icons/DocumentAddIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ActionPanelProps {
  onOpenModal: (type: ModalType) => void;
  onOpenNewAssetModal: () => void;
  onExportCSV: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({ onOpenModal, onOpenNewAssetModal, onExportCSV }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-2xl">
      <h2 className="text-xl font-bold mb-4 text-slate-200 border-b border-slate-700 pb-2">
        Panel de Acciones
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onOpenModal(ModalType.IN)}
          className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
        >
          <PlusIcon />
          ENTRADA
        </button>
        <button
          onClick={() => onOpenModal(ModalType.OUT)}
          className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
        >
          <MinusIcon />
          SALIDA
        </button>
      </div>
      <div className="space-y-4 mt-4">
        <button
          onClick={onOpenNewAssetModal}
          className="w-full flex items-center justify-center gap-3 bg-brand-accent hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
        >
          <DocumentAddIcon />
          Añadir Nuevo Activo
        </button>
        <button
          onClick={onExportCSV}
          className="w-full flex items-center justify-center gap-3 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
        >
          <DownloadIcon />
          Exportar a CSV
        </button>
      </div>
       <p className="text-xs text-slate-500 mt-6 text-center">
        Use estos botones para registrar movimientos o exportar la vista actual del inventario.
      </p>
    </div>
  );
};

export default ActionPanel;
