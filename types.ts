export interface InventoryItem {
  id: string; // ID_Activo (Key)
  name: string; // Nombre_Activo (Label)
  category: string; // Categoria
  currentStock: number; // Cantidad_Actual
  minStock: number; // Stock_Minimo
  managerEmail: string; // Encargado_Email
  lastModified: string; // Ultima_Modificacion
  unitOfMeasure: string; // e.g., 'unidades', 'litros', 'metros'
  description: string; // Brief description of the item
  status: 'active' | 'inactive';
}

export interface Notification {
  id: number;
  type: 'alert' | 'success';
  message: string;
  details?: string;
  itemId?: string; // Optional: for stock alerts
  // Add structured data for alerts to build mailto links
  itemName?: string;
  currentStock?: number;
  minStock?: number;
}

export enum ModalType {
  IN = "ENTRADA",
  OUT = "SALIDA"
}

export interface NewInventoryItemData {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  managerEmail: string;
  unitOfMeasure: string;
  description: string;
}

export interface UpdateInventoryItemData {
  id: string;
  name: string;
  category: string;
  minStock: number;
  managerEmail: string;
  unitOfMeasure: string;
  description: string;
}

export enum HistoryType {
  IN = "ENTRADA",
  OUT = "SALIDA",
  CREATED = "CREADO",
  EDITED = "EDITADO"
}

export interface HistoryEntry {
  id: number;
  type: HistoryType;
  itemId: string;
  itemName: string;
  quantityChange?: number;
  timestamp: string;
}