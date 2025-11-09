import React from 'react';

type StatusFilterType = 'active' | 'inactive' | 'all';

interface StatusFilterProps {
  filter: StatusFilterType;
  onChange: (filter: StatusFilterType) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ filter, onChange }) => {
  const options: { value: StatusFilterType; label: string }[] = [
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
    { value: 'all', label: 'Todos' },
  ];

  return (
    <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1 shadow-lg">
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
            filter === option.value
              ? 'bg-brand-accent text-white shadow-md'
              : 'text-slate-400 hover:bg-slate-700/50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
