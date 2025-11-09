import React, { useState, useEffect } from 'react';
import { InventoryItem, Notification, ModalType, NewInventoryItemData, HistoryEntry, HistoryType, UpdateInventoryItemData } from './types';
import Header from './components/Header';
import ActionPanel from './components/ActionPanel';
import InventoryTable from './components/InventoryTable';
import StockModal from './components/StockModal';
import AlertNotifications from './components/AlertNotifications';
import SearchBar from './components/SearchBar';
import StatusFilter from './components/StatusFilter';
import NewAssetModal from './components/NewAssetModal';
import HistoryLog from './components/HistoryLog';
import EditAssetModal from './components/EditAssetModal';
import AssetDetailsModal from './components/AssetDetailsModal';

// Initial mock data based on the blueprint
const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'VAL-KOSO-001', name: 'Válvula Koso 2-pulg', category: 'Válvulas', currentStock: 10, minStock: 3, managerEmail: 'gerente.almacen@gtb.com', lastModified: new Date().toISOString(), status: 'active', unitOfMeasure: 'unidades', description: 'Válvula de control de flujo Koso de 2 pulgadas, cuerpo de acero inoxidable.' },
  { id: 'FIL-PARKER-005', name: 'Filtro Parker H2', category: 'Filtros', currentStock: 5, minStock: 5, managerEmail: 'gerente.almacen@gtb.com', lastModified: new Date().toISOString(), status: 'active', unitOfMeasure: 'unidades', description: 'Filtro de alta presión para sistema hidráulico Parker.' },
  { id: 'REP-SEAL-003', name: 'Repuesto Sello G-20', category: 'Repuestos', currentStock: 25, minStock: 10, managerEmail: 'compras@gtb.com', lastModified: new Date().toISOString(), status: 'active', unitOfMeasure: 'juegos', description: 'Juego de sellos de repuesto para bomba G-20.' },
  { id: 'MOTOR-WEG-010', name: 'Motor Eléctrico WEG 5HP', category: 'Motores', currentStock: 2, minStock: 2, managerEmail: 'gerente.almacen@gtb.com', lastModified: new Date().toISOString(), status: 'inactive', unitOfMeasure: 'unidades', description: 'Motor eléctrico trifásico WEG de 5 caballos de fuerza.' },
];

const App: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewAssetModalOpen, setIsNewAssetModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'all'>('active');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<InventoryItem | null>(null);


  const checkStockLevels = (updatedInventory: InventoryItem[]) => {
    // Operate only on alert-type notifications
    const currentAlerts = notifications.filter(n => n.type === 'alert');
    
    // Find item IDs that should no longer have alerts (replenished or inactive)
    const resolvedAlertItemIds = new Set(
      currentAlerts
        .map(alert => updatedInventory.find(item => item.id === alert.itemId))
        .filter((item): item is InventoryItem => 
          !item || // Item was removed (future-proofing)
          item.status === 'inactive' || 
          item.currentStock > item.minStock
        )
        .map(item => item.id)
    );

    // Keep non-alert notifications and alerts that are not resolved
    const stillActiveNotifications = notifications.filter(n => {
        if (n.type !== 'alert') return true;
        return !resolvedAlertItemIds.has(n.itemId!);
    });

    const activeAlertItemIds = new Set(
        stillActiveNotifications.filter(n => n.type === 'alert').map(a => a.itemId)
    );

    // Find new items that need alerts (active and low stock)
    const newAlerts: Notification[] = updatedInventory
      .filter(item => 
        item.status === 'active' &&
        item.currentStock <= item.minStock &&
        !activeAlertItemIds.has(item.id)
      )
      .map(item => ({
        id: Date.now() + Math.random(),
        type: 'alert',
        itemId: item.id,
        itemName: item.name,
        currentStock: item.currentStock,
        minStock: item.minStock,
        message: `¡ALERTA DE STOCK BAJO! - ${item.name}`,
        details: `Stock actual: ${item.currentStock}, Mínimo: ${item.minStock}. Contactar a marindelgado512@gmail.com.`
      }));
    
    setNotifications([...stillActiveNotifications, ...newAlerts]);
  };
  
  // Initial check on load
  useEffect(() => {
    checkStockLevels(inventory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenModal = (type: ModalType) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };
  
  const handleOpenNewAssetModal = () => setIsNewAssetModalOpen(true);
  const handleCloseNewAssetModal = () => setIsNewAssetModalOpen(false);
  
  const handleOpenEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleOpenDetailsModal = (item: InventoryItem) => {
    setSelectedItemForDetails(item);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedItemForDetails(null);
  };

  const addHistoryEntry = (
    type: HistoryType,
    itemId: string,
    itemName: string,
    timestamp: string,
    quantityChange?: number
  ) => {
    const newHistoryEntry: HistoryEntry = {
      id: Date.now(),
      type,
      itemId,
      itemName,
      timestamp,
      quantityChange,
    };
    setHistory(prevHistory => [newHistoryEntry, ...prevHistory]);
  };


  const handleAddNewItem = (newItemData: NewInventoryItemData) => {
    const idExists = inventory.some(
      item => item.id.toLowerCase() === newItemData.id.toLowerCase()
    );

    if (idExists) {
      alert(`Error: Ya existe un activo con el ID "${newItemData.id}".`);
      return;
    }

    const newItem: InventoryItem = {
      ...newItemData,
      lastModified: new Date().toISOString(),
      status: 'active',
    };
    
    const updatedInventory = [...inventory, newItem];
    setInventory(updatedInventory);
    checkStockLevels(updatedInventory);

    addHistoryEntry(
        HistoryType.CREATED,
        newItem.id,
        newItem.name,
        newItem.lastModified
    );

    handleCloseNewAssetModal();

    const successNotification: Notification = {
      id: Date.now(),
      type: 'success',
      message: 'Activo creado con éxito',
      details: `El activo "${newItem.name}" ha sido añadido.`
    };

    setNotifications(prev => [...prev, successNotification]);

    setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== successNotification.id));
    }, 5000); // dismiss after 5 seconds
  };
  
  const handleUpdateItem = (updatedData: UpdateInventoryItemData) => {
    const lastModified = new Date().toISOString();
    const updatedInventory = inventory.map(item => {
        if (item.id === updatedData.id) {
            return {
                ...item,
                ...updatedData,
                lastModified,
            };
        }
        return item;
    });

    setInventory(updatedInventory);
    checkStockLevels(updatedInventory);

    addHistoryEntry(
        HistoryType.EDITED,
        updatedData.id,
        updatedData.name,
        lastModified
    );

    handleCloseEditModal();
  };

  const handleStockUpdate = (itemId: string, quantity: number) => {
    const targetItem = inventory.find(item => item.id.toLowerCase() === itemId.toLowerCase());

    if (!targetItem) {
        alert(`Error: Activo con ID "${itemId}" no encontrado.`);
        return;
    }

    if (targetItem.status === 'inactive') {
        alert("Error: No se puede modificar el stock de un activo inactivo.");
        return;
    }

    let negativeStockError = false;
    const updatedInventory = inventory.map(item => {
      if (item.id === targetItem.id) {
        const newStock = modalType === ModalType.IN
          ? item.currentStock + quantity
          : item.currentStock - quantity;
        
        if (newStock < 0) {
            alert("Error: No se puede registrar la salida. El stock no puede ser negativo.");
            negativeStockError = true;
            return item;
        }

        return {
          ...item,
          currentStock: newStock,
          lastModified: new Date().toISOString()
        };
      }
      return item;
    });

    if (!negativeStockError) {
      setInventory(updatedInventory);
      checkStockLevels(updatedInventory);

      const updatedItem = updatedInventory.find(item => item.id === targetItem.id)!;
      addHistoryEntry(
          modalType === ModalType.IN ? HistoryType.IN : HistoryType.OUT,
          targetItem.id,
          targetItem.name,
          updatedItem.lastModified,
          quantity
      );

      handleCloseModal();
    }
  };
  
  const dismissNotification = (notificationId: number) => {
    setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== notificationId));
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleToggleStatus = (itemId: string) => {
    const updatedInventory = inventory.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: item.status === 'active' ? 'inactive' : 'active',
          lastModified: new Date().toISOString(),
        };
      }
      return item;
    });
    setInventory(updatedInventory);
    checkStockLevels(updatedInventory);
  };

  const filteredInventory = inventory
    .filter(item => {
      if (statusFilter === 'all') return true;
      return item.status === statusFilter;
    })
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleExportCSV = () => {
    if (filteredInventory.length === 0) {
        alert("No hay datos para exportar con los filtros actuales.");
        return;
    }

    const headers = ['ID_Activo', 'Nombre_Activo', 'Categoria', 'Cantidad_Actual', 'Stock_Minimo', 'Unidad_Medida', 'Descripcion', 'Encargado_Email', 'Ultima_Modificacion', 'Estado'];
    
    const csvRows = [
        headers.join(','),
        ...filteredInventory.map(item => {
            const row = [
                item.id,
                `"${item.name.replace(/"/g, '""')}"`, // Handle quotes in name
                item.category,
                item.currentStock,
                item.minStock,
                item.unitOfMeasure,
                `"${item.description.replace(/"/g, '""')}"`, // Handle quotes in description
                item.managerEmail,
                item.lastModified,
                item.status
            ];
            return row.join(',');
        })
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    const date = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `inventario_gtb_${date}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <AlertNotifications alerts={notifications} onDismiss={dismissNotification} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <ActionPanel 
              onOpenModal={handleOpenModal} 
              onOpenNewAssetModal={handleOpenNewAssetModal} 
              onExportCSV={handleExportCSV}
            />
            <HistoryLog history={history} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                    <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
                </div>
                <StatusFilter filter={statusFilter} onChange={setStatusFilter} />
            </div>
            <InventoryTable 
              inventory={filteredInventory} 
              onToggleStatus={handleToggleStatus} 
              onOpenEditModal={handleOpenEditModal}
              onOpenDetailsModal={handleOpenDetailsModal}
            />
          </div>
        </div>
      </main>
      {isModalOpen && modalType && (
        <StockModal
          type={modalType}
          onClose={handleCloseModal}
          onSubmit={handleStockUpdate}
        />
      )}
      {isNewAssetModalOpen && (
        <NewAssetModal 
          onClose={handleCloseNewAssetModal}
          onSubmit={handleAddNewItem}
        />
      )}
      {isEditModalOpen && editingItem && (
        <EditAssetModal
          item={editingItem}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateItem}
        />
      )}
      {isDetailsModalOpen && selectedItemForDetails && (
        <AssetDetailsModal
          item={selectedItemForDetails}
          onClose={handleCloseDetailsModal}
        />
      )}
    </div>
  );
};

export default App;