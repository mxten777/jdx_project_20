import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeModalProps {
  value: string;
  open: boolean;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ value, open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white dark:bg-navy-900 rounded-2xl p-6 shadow-xl relative w-80 flex flex-col items-center">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl"
          onClick={onClose}
          title="닫기"
        >
          ×
        </button>
        <h3 className="text-lg font-bold mb-4 text-gradient">QR코드로 공유</h3>
  <QRCodeSVG value={value} size={200} bgColor="#fff" fgColor="#111" includeMargin={true} />
        <p className="mt-4 text-xs text-gray-500 dark:text-gray-300 text-center">
          이 QR코드를 스캔하면 번호 조합을 빠르게 공유할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default QRCodeModal;
