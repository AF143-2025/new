import React from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in pointer-events-none">
      <div className="bg-[#141210]/95 backdrop-blur-md border border-[#B99A5B] text-[#F5F1EA] px-5 py-2.5 rounded-sm shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm">
        <Sparkles className="w-4 h-4 text-[#B99A5B] shrink-0" />
        <span className="font-medium">{toastMessage}</span>
      </div>
    </div>
  );
};
