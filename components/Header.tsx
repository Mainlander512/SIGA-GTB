
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-20">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          SIGA-GTB
        </h1>
        <p className="text-sm text-slate-400">
          Sistema Inteligente de Gestión de Almacén
        </p>
      </div>
    </header>
  );
};

export default Header;
