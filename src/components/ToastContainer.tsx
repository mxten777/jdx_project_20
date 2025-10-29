import React, { memo } from 'react';
import { Toast } from './Toast';
import type { ToastMessage } from '../types/lotto';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = memo(({ 
  toasts, 
  onRemove 
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[10000] space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
});

ToastContainer.displayName = 'ToastContainer';
