
import React, { useState } from 'react';
import { ModalType } from '../types';
import { CloseIcon } from './icons/CloseIcon';

interface StockModalProps {
  type: ModalType;
  onClose: () => void;
  onSubmit: (itemId: string, quantity: number) => void;
}

const StockModal: React.FC<StockModalProps> = ({ type, onClose, onSubmit }) => {
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemId.trim() && quantity > 0) {
      onSubmit(itemId.trim(), quantity);
    } else {
        alert("Por favor, ingrese un ID de activo válido y una cantidad mayor a cero.");
    }
  };
  
  const isEntrada = type === ModalType.IN;
  const title = `Registrar ${isEntrada ? 'Entrada' : 'Salida'} de Stock`;
  const buttonColor = isEntrada ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';
  const ringColor = isEntrada ? 'focus:ring-green-500' : 'focus:ring-red-500';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md relative border border-slate-700">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white">
          <CloseIcon />
        </button>
        <h2 className="text-xl font-bold mb-6 text-center">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="itemId" className="block text-sm font-medium text-slate-300 mb-1">
              ID del Activo (QR)
            </label>
            <input
              type="text"
              id="itemId"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              placeholder="Ej: VAL-KOSO-001"
              required
              autoFocus
              className={`w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 ${ringColor}`}
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-slate-300 mb-1">
              ¿Cuántas unidades {isEntrada ? 'entran' : 'salen'}?
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
              min="1"
              required
              className={`w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 ${ringColor}`}
            />
          </div>
          <button
            type="submit"
            className={`w-full font-bold text-white py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg mt-2 ${buttonColor}`}
          >
            Confirmar {type}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StockModal;
