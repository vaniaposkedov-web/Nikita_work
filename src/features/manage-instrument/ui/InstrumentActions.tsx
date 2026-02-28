'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Trash2, Edit, Copy, BarChart3 } from 'lucide-react';
import { useInstrumentStore } from '@/shared/store/useInstrumentStore';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  id: string;
}

export const InstrumentActions = ({ id }: Props) => {
  const removeInstrument = useInstrumentStore((state) => state.removeInstrument);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button 
          className="relative flex items-center justify-center w-[36px] h-[36px] bg-white rounded-full p-[8px] active:scale-95 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          aria-label="Действия"
        >
          <div className="relative w-[20px] h-[20px]">
            <svg 
              style={{ 
                position: 'absolute', 
                top: '8.96px', 
                left: '3.96px', 
                width: '12.09px', 
                height: '2.08px' 
              }} 
              viewBox="0 0 12 2" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="1.04" cy="1.04" r="1.04" fill="#1A1A1A" />
              <circle cx="6.04" cy="1.04" r="1.04" fill="#1A1A1A" />
              <circle cx="11.04" cy="1.04" r="1.04" fill="#1A1A1A" />
            </svg>
          </div>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          asChild
          align="end" 
          sideOffset={8}
          className="z-[100]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-[151px] bg-white rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] py-1.5 overflow-hidden border border-black/5 outline-none"
          >
            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-[10px] text-[14px] font-medium text-[#1A1A1A] outline-none cursor-pointer hover:bg-slate-50 transition-colors border-b border-[#E6E6E6]/50">
              <Copy size={16} className="opacity-70 text-[#573DEB]" /> 
              <span className="tracking-[-0.02em]">Копировать</span>
            </DropdownMenu.Item>
            
            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-[10px] text-[14px] font-medium text-[#1A1A1A] outline-none cursor-pointer hover:bg-slate-50 transition-colors border-b border-[#E6E6E6]/50">
              <BarChart3 size={16} className="opacity-70 text-[#573DEB]" /> 
              <span className="tracking-[-0.02em]">Статистика</span>
            </DropdownMenu.Item>
            
            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-[10px] text-[14px] font-medium text-[#1A1A1A] outline-none cursor-pointer hover:bg-slate-50 transition-colors border-b border-[#E6E6E6]/50">
              <Edit size={16} className="opacity-70 text-[#573DEB]" /> 
              <span className="tracking-[-0.02em]">Редактировать</span>
            </DropdownMenu.Item>
            
            <DropdownMenu.Item 
              onClick={() => removeInstrument(id)}
              className="flex items-center gap-2 px-3 py-[10px] text-[14px] font-medium text-[#FF4B4B] outline-none cursor-pointer hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} className="opacity-80" /> 
              <span className="tracking-[-0.02em]">Удалить</span>
            </DropdownMenu.Item>
          </motion.div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};