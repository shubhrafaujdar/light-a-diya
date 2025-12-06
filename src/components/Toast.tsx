'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export default function Toast({ message, type = 'info', duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
      role="alert"
    >
      <span className="text-xl font-bold">{icon}</span>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsVisible(false);
            onClose?.();
          }, 300);
        }}
        className="ml-2 text-white hover:text-gray-200 transition-colors"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}
