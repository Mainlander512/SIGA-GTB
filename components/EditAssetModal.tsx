import React, { useState, useEffect } from 'react';
import { InventoryItem, UpdateInventoryItemData } from '../types';
import { CloseIcon } from './icons/CloseIcon';

interface EditAssetModalProps {
  item: InventoryItem;
  onClose: () => void;
  onSubmit: (itemData: UpdateInventoryItemData) => void;
}

const EditAssetModal: React.FC<EditAssetModalProps> = ({ item, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<UpdateInventoryItemData>({
    id: item.id,
    name: item.name,
    category: item.category,
    minStock: item.minStock,
    managerEmail: item.managerEmail,
    unitOfMeasure: item.unitOfMeasure,
    description: item.description,
  });

  useEffect(() => {
    setFormData({
      id: item.id,
      name: item.name,
      category: item.category,
      minStock: item.minStock,
      managerEmail: item.managerEmail,
      unitOfMeasure: item.unitOfMeasure,
      description: item.description,
    });
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData(prev => ({
      ...prev,
      [name]: isNumber ? Math.max(0, parseInt(value, 10) || 0) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() === '' || formData.category.trim() === '' || formData.managerEmail.trim() === '' || formData.unitOfMeasure.trim() === '') {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }
    onSubmit(formData);
  };

  const inputClass = "w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent";
  const disabledInputClass = "w-full bg-slate-900/50 border border-slate-700 rounded-md px-3 py-2 text-slate-400 cursor-not-allowed";
  const labelClass = "block text-sm font-medium text-slate-300 mb-1";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-lg relative border border-slate-700">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white">
          <CloseIcon />
        </button>
        <h2 className="text-xl font-bold mb-6 text-center">Editar Activo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="id" className={labelClass}>ID del Activo</label>
              <input type="text" id="id" name="id" value={formData.id} readOnly className={disabledInputClass} />
            </div>
            <div>
              <label htmlFor="name" className={labelClass}>Nombre del Activo</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ej: Repuesto Sello G-21" required className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className={labelClass}>Categoría</label>
              <input type="text" id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Ej: Repuestos" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="unitOfMeasure" className={labelClass}>Unidad de Medida</label>
              <input type="text" id="unitOfMeasure" name="unitOfMeasure" value={formData.unitOfMeasure} onChange={handleChange} placeholder="Ej: unidades, kg, litros" required className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Descripción (Opcional)</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={2} placeholder="Añadir una breve descripción del activo..." className={`${inputClass} resize-y`}></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label htmlFor="currentStock" className={labelClass}>Stock Actual</label>
                <input type="number" id="currentStock" name="currentStock" value={item.currentStock} readOnly className={disabledInputClass} />
            </div>
            <div>
              <label htmlFor="minStock" className={labelClass}>Stock Mínimo</label>
              <input type="number" id="minStock" name="minStock" value={formData.minStock} onChange={handleChange} min="0" required className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="managerEmail" className={labelClass}>Email del Encargado</label>
            <input type="email" id="managerEmail" name="managerEmail" value={formData.managerEmail} onChange={handleChange} placeholder="ejemplo@gtb.com" required className={inputClass} />
          </div>
          <button
            type="submit"
            className="w-full font-bold text-white py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg mt-2 bg-brand-accent hover:bg-brand-secondary"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAssetModal;
