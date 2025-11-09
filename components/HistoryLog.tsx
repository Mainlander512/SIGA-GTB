import React, { useState, useMemo } from 'react';
import { HistoryEntry, HistoryType } from '../types';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { DocumentAddIcon } from './icons/DocumentAddIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { SearchIcon } from './icons/SearchIcon';
import { EditIcon } from './icons/EditIcon';


interface HistoryLogProps {
  history: HistoryEntry[];
}

type HistoryFilterType = 'all' | HistoryType | 'movements';
type SortKey = 'timestamp' | 'itemName' | 'itemId';

const HistoryLog: React.FC<HistoryLogProps> = ({ history }) => {
  const [filter, setFilter] = useState<HistoryFilterType>('all');
  const [sortBy, setSortBy] = useState<SortKey>('timestamp');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');


  const getEntryDetails = (entry: HistoryEntry) => {
    switch (entry.type) {
      case HistoryType.IN:
        return {
          icon: <ArrowUpIcon />,
          color: 'text-green-400',
          title: `ENTRADA: ${entry.itemName}`,
          description: `Se añadieron ${entry.quantityChange} unidades.`,
        };
      case HistoryType.OUT:
        return {
          icon: <ArrowDownIcon />,
          color: 'text-red-400',
          title: `SALIDA: ${entry.itemName}`,
          description: `Se retiraron ${entry.quantityChange} unidades.`,
        };
      case HistoryType.CREATED:
        return {
          icon: <DocumentAddIcon />,
          color: 'text-blue-400',
          title: `NUEVO ACTIVO: ${entry.itemName}`,
          description: 'Activo registrado en el sistema.',
        };
      case HistoryType.EDITED:
        return {
          icon: <EditIcon />,
          color: 'text-yellow-400',
          title: `ACTIVO EDITADO: ${entry.itemName}`,
          description: 'Se modificaron los detalles del activo.',
        };
      default:
        return {
          icon: null,
          color: '',
          title: '',
          description: '',
        };
    }
  };

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const filteredHistory = useMemo(() => {
    const processedHistory = history
      .filter(entry => {
        // Type filter
        const typeMatch =
          filter === 'all' ||
          (filter === 'movements' && (entry.type === HistoryType.IN || entry.type === HistoryType.OUT)) ||
          entry.type === filter;
        if (!typeMatch) {
          return false;
        }

        // Date filter
        const entryDate = new Date(entry.timestamp);

        if (startDate) {
          const start = new Date(startDate);
          start.setUTCHours(0, 0, 0, 0); // Use UTC to avoid timezone issues
          if (entryDate < start) {
            return false;
          }
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setUTCHours(23, 59, 59, 999); // Compare until the end of the day
          if (entryDate > end) {
            return false;
          }
        }
        
        // Search Term Filter
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const nameMatch = entry.itemName.toLowerCase().includes(term);
          const idMatch = entry.itemId.toLowerCase().includes(term);
          if (!nameMatch && !idMatch) {
            return false;
          }
        }

        return true;
      });

    // Sorting
    processedHistory.sort((a, b) => {
      switch (sortBy) {
        case 'itemName':
          return a.itemName.localeCompare(b.itemName);
        case 'itemId':
          return a.itemId.localeCompare(b.itemId);
        case 'timestamp':
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

    return processedHistory;
  }, [history, filter, startDate, endDate, searchTerm, sortBy]);


  const handleResetDates = () => {
    setStartDate('');
    setEndDate('');
  };

  const filterOptions: { value: HistoryFilterType; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'movements', label: 'Movimientos' },
    { value: HistoryType.IN, label: 'Entradas' },
    { value: HistoryType.OUT, label: 'Salidas' },
    { value: HistoryType.CREATED, label: 'Creaciones' },
    { value: HistoryType.EDITED, label: 'Ediciones' },
  ];

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'timestamp', label: 'Más Reciente' },
    { key: 'itemName', label: 'Nombre (A-Z)' },
    { key: 'itemId', label: 'ID (A-Z)' },
  ];


  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-2xl">
      <h2 className="text-xl font-bold mb-4 text-slate-200 border-b border-slate-700 pb-2">
        Historial de Actividad
      </h2>

      <div className="flex space-x-1 bg-slate-900/50 rounded-lg p-1 overflow-x-auto">
        {filterOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`flex-1 text-xs font-bold py-2 px-2 rounded-md transition-colors whitespace-nowrap ${
              filter === option.value
                ? 'bg-brand-accent text-white'
                : 'text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

       <div className="flex space-x-1 bg-slate-900/50 rounded-lg p-1 mt-3 overflow-x-auto">
        {sortOptions.map(option => (
          <button
            key={option.key}
            onClick={() => setSortBy(option.key)}
            className={`flex-1 text-xs font-bold py-2 px-2 rounded-md transition-colors whitespace-nowrap ${
              sortBy === option.key
                ? 'bg-brand-accent/70 text-white'
                : 'text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label htmlFor="startDate" className="block text-xs font-medium text-slate-400 mb-1">Desde</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon />
             </div>
             <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm appearance-none"
             />
          </div>
        </div>
        <div>
          <label htmlFor="endDate" className="block text-xs font-medium text-slate-400 mb-1">Hasta</label>
           <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon />
             </div>
             <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm appearance-none"
             />
          </div>
        </div>
      </div>
       {(startDate || endDate) && (
          <button 
            onClick={handleResetDates}
            className="w-full mt-3 flex items-center justify-center gap-2 text-xs text-brand-accent hover:text-white transition-colors"
          >
            <RefreshIcon />
            Limpiar filtro de fechas
          </button>
      )}

      <div className="relative mt-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
        </div>
        <input
            type="text"
            placeholder="Buscar por nombre o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-accent text-sm"
            aria-label="Buscar en historial"
        />
      </div>

      <ul className="mt-4 space-y-4 max-h-[20rem] overflow-y-auto pr-2 custom-scrollbar">
        {filteredHistory.length > 0 ? (
          filteredHistory.map(entry => {
            const { icon, color, title, description } = getEntryDetails(entry);
            return (
              <li key={entry.id} className="flex items-start gap-4 animate-fade-in">
                <div className={`mt-1 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-slate-700 ${color}`}>
                  {React.cloneElement(icon as React.ReactElement, { className: 'h-5 w-5' })}
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-sm text-slate-200 leading-tight">{title}</p>
                  <p className="text-xs text-slate-400">{description}</p>
                  <p className="text-xs text-slate-500 pt-1">{formatDateTime(entry.timestamp)}</p>
                </div>
              </li>
            );
          })
        ) : (
          <p className="text-center text-slate-500 py-10">No hay registros para este filtro.</p>
        )}
      </ul>
    </div>
  );
};

export default HistoryLog;