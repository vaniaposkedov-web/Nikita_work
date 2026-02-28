'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { useNavigationStore } from '@/shared/store/useNavigationStore';

interface DepositDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: any | null; 
}

export const DepositDrawer = ({ isOpen, onClose, order }: DepositDrawerProps) => {
  const setNavVisibility = useNavigationStore(state => state.setNavVisibility);
  const [view, setView] = useState<'menu' | 'partial'>('menu');
  const [partialAmount, setPartialAmount] = useState('');
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNavVisibility(false); // ПРЯЧЕМ МЕНЮ
      setView('menu');
      setPartialAmount('');
      if (drawerRef.current) disableBodyScroll(drawerRef.current);
    } else {
      setNavVisibility(true); // ВОЗВРАЩАЕМ МЕНЮ
      clearAllBodyScrollLocks();
    }
    return () => {
      setNavVisibility(true);
      clearAllBodyScrollLocks();
    };
  }, [isOpen, setNavVisibility]);

  const handleClose = () => {
    onClose();
    setTimeout(() => setView('menu'), 300); 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-[2px]"
          />
          <motion.div
            ref={drawerRef}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed bottom-0 left-0 right-0 bg-white z-[201] rounded-t-[32px] p-5 pb-12 shadow-[0_-8px_32px_rgba(0,0,0,0.15)]"
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center mb-6 px-1">
              <h2 className="text-[22px] font-black text-[#1A1A1A] tracking-tight">
                {view === 'menu' ? 'Залог' : 'Возврат'}
              </h2>
              <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F4F5F7] active:scale-90 transition-all">
                <X size={22} className="text-[#1A1A1A]" />
              </button>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                {view === 'menu' ? (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <button className="w-full h-[56px] bg-[#F4F5F7] active:bg-[#EAECEF] text-[#1A1A1A] font-bold text-[15px] rounded-[18px] transition-all">Вернуть полностью</button>
                    <button onClick={() => setView('partial')} className="w-full h-[56px] bg-[#F4F5F7] active:bg-[#EAECEF] text-[#1A1A1A] font-bold text-[15px] rounded-[18px] transition-all">Вернуть частично</button>
                    <button className="w-full h-[56px] bg-[#F4F5F7] active:bg-[#EAECEF] text-[#FF4747] font-bold text-[15px] rounded-[18px] transition-all">Присвоить залог</button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="partial"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col"
                  >
                    <div className="bg-[#E7F7FE] rounded-[20px] h-[84px] px-6 flex items-center justify-between mb-6">
                      <span className="text-[#999999] text-[15px] font-bold uppercase tracking-wider">Залог</span>
                      <span className="text-[#0FB3FA] text-[32px] font-black tracking-tight">{order?.deposit || '0'} ₽</span>
                    </div>
                    <div className="mb-8">
                      <p className="text-[13px] font-bold text-[#999999] ml-4 mb-2 uppercase tracking-wider">Сумма возврата:</p>
                      <div className="relative">
                        <input type="number" value={partialAmount} onChange={(e) => setPartialAmount(e.target.value)} placeholder="0" className="w-full h-[60px] border-2 border-[#F4F5F7] rounded-[20px] px-5 text-[18px] font-black outline-none focus:border-[#573DEB]/30 transition-all" />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#999999] font-black">₽</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setView('menu')} className="flex-1 h-[58px] bg-[#F4F5F7] text-[#1A1A1A] font-bold text-[16px] rounded-[20px] active:scale-95 transition-all">Отмена</button>
                      <button className="flex-1 h-[58px] bg-[#573DEB] text-white font-black text-[16px] rounded-[20px] shadow-lg active:scale-95 transition-all">Вернуть</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};