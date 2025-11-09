import React from 'react';
import { Notification } from '../types';
import { AlertIcon } from './icons/AlertIcon';
import { CloseIcon } from './icons/CloseIcon';
import { CheckIcon } from './icons/CheckIcon';
import { MailIcon } from './icons/MailIcon';

interface AlertNotificationsProps {
  alerts: Notification[];
  onDismiss: (alertId: number) => void;
}

const AlertNotifications: React.FC<AlertNotificationsProps> = ({ alerts, onDismiss }) => {
  if (alerts.length === 0) {
    return null;
  }

  const getNotificationStyle = (type: 'alert' | 'success') => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-500/10 border border-green-400/50 text-green-200',
          icon: <CheckIcon />,
          detailsText: 'text-green-300',
          dismissButton: 'text-green-300 hover:bg-green-500/20',
        };
      case 'alert':
      default:
        return {
          container: 'bg-yellow-500/10 border border-yellow-400/50 text-yellow-200',
          icon: <AlertIcon />,
          detailsText: 'text-yellow-300',
          dismissButton: 'text-yellow-300 hover:bg-yellow-500/20',
        };
    }
  };

  const createMailtoLink = (notification: Notification): string => {
    const email = 'marindelgado512@gmail.com';
    const subject = encodeURIComponent(`ALERTA DE STOCK BAJO: ${notification.itemName}`);
    const body = encodeURIComponent(
`Hola,

Este es un aviso de que el activo "${notification.itemName}" (ID: ${notification.itemId}) ha alcanzado un nivel de stock bajo.

Detalles:
- Stock Actual: ${notification.currentStock}
- Stock Mínimo: ${notification.minStock}

Por favor, proceda con la gestión de reposición.

Gracias,
SIGA-GTB`
    );
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed top-20 right-4 md:right-6 z-50 w-full max-w-sm">
      <div className="space-y-3">
        {alerts.map((notification) => {
          const styles = getNotificationStyle(notification.type);
          return (
            <div
              key={notification.id}
              className={`${styles.container} px-4 py-3 rounded-lg relative shadow-lg backdrop-blur-md animate-fade-in-down`}
              role={notification.type === 'alert' ? 'alert' : 'status'}
            >
              <div className="flex items-start">
                <div className="py-1">
                  {styles.icon}
                </div>
                <div className="ml-3 flex-grow">
                  <strong className="font-bold">{notification.message}</strong>
                  {notification.details && <p className={`text-sm ${styles.detailsText}`}>{notification.details}</p>}
                  {notification.type === 'alert' && notification.itemId && (
                    <a
                      href={createMailtoLink(notification)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-100 font-bold text-xs py-1.5 px-3 rounded-md transition-colors"
                    >
                      <MailIcon />
                      Notificar por Email
                    </a>
                  )}
                </div>
                <button
                  onClick={() => onDismiss(notification.id)}
                  className={`ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg focus:outline-none ${styles.dismissButton}`}
                  aria-label="Cerrar notificación"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertNotifications;