import { useEffect, useState, useCallback, useRef } from 'react';
import { X, Bell, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const TOAST_ICONS: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
};

const TOAST_STYLES: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
};

const TOAST_ICON_STYLES: Record<ToastType, string> = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-blue-500'
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const Icon = TOAST_ICONS[toast.type];
  const duration = toast.duration ?? 5000;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onDismiss(toast.id), duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, duration, onDismiss]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-fade-in-up',
        'min-w-[320px] max-w-md w-full',
        TOAST_STYLES[toast.type]
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', TOAST_ICON_STYLES[toast.type])} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{toast.title}</p>
        {toast.message && (
          <p className="text-sm opacity-80 mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Global toast state
let toasts: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

function notifyListeners() {
  listeners.forEach(listener => listener([...toasts]));
}

export const toast = {
  show: (options: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    toasts = [...toasts, { ...options, id }];
    notifyListeners();
    return id;
  },
  dismiss: (id: string) => {
    toasts = toasts.filter(t => t.id !== id);
    notifyListeners();
  },
  success: (title: string, message?: string) => toast.show({ type: 'success', title, message }),
  error: (title: string, message?: string) => toast.show({ type: 'error', title, message, duration: 8000 }),
  warning: (title: string, message?: string) => toast.show({ type: 'warning', title, message }),
  info: (title: string, message?: string) => toast.show({ type: 'info', title, message }),
};

// Toast container component
export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const listener = (newToasts: Toast[]) => setCurrentToasts(newToasts);
    listeners.push(listener);
    setCurrentToasts([...toasts]);

    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  const handleDismiss = useCallback((id: string) => {
    toast.dismiss(id);
  }, []);

  if (currentToasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {currentToasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={handleDismiss} />
        </div>
      ))}
    </div>
  );
}

// Browser notification hook
export function useBrowserNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return 'denied';
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const notifyBrowser = useCallback((title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
  }, [permission]);

  return { permission, requestPermission, notifyBrowser };
}

// Notification bell indicator component
export function NotificationBell() {
  const { permission, requestPermission } = useBrowserNotifications();
  const [showDot, setShowDot] = useState(false);

  useEffect(() => {
    setShowDot(permission !== 'granted');
  }, [permission]);

  if (permission === 'denied') return null;

  if (permission !== 'granted') {
    return (
      <button
        onClick={requestPermission}
        className="relative p-2 rounded-lg text-midnight/60 hover:text-midnight hover:bg-sandstone/50 transition-colors"
        title="Enable notifications"
      >
        <Bell className="w-5 h-5" />
        {showDot && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-ember rounded-full" />
        )}
      </button>
    );
  }

  return (
    <button
      className="relative p-2 rounded-lg text-midnight/60 hover:text-midnight hover:bg-sandstone/50 transition-colors"
      title="Notifications enabled"
    >
      <Bell className="w-5 h-5" />
    </button>
  );
}