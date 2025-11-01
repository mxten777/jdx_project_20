import { useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);

  console.log('Modal render - open:', open);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    scrollYRef.current = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      window.scrollTo(0, scrollYRef.current);
    };
  }, [open]);

  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  // 백드롭 클릭 시에만 닫히도록
  const handleBackdropClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      style={{ 
        touchAction: 'none', 
        WebkitTapHighlightColor: 'transparent',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="w-full max-w-4xl max-h-[95vh] overflow-hidden pointer-events-auto"
        onClick={e => e.stopPropagation()}
        onTouchStart={e => e.stopPropagation()}
        tabIndex={-1}
        style={{ 
          WebkitOverflowScrolling: 'touch',
          touchAction: 'auto',
          pointerEvents: 'auto'
        }}
      >
        {children}
      </div>
    </div>
  );
}