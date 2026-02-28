'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from "@/shared/lib/utils";
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { useServicesStore } from '@/shared/store/useServicesStore';
import { useNavigationStore } from '@/shared/store/useNavigationStore';

const PERIODS = [
  { label: 'Час', value: 'час' },
  { label: 'День', value: 'день' },
  { label: 'Месяц', value: 'месяц' },
] as const;

export const AddServiceDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const addService = useServicesStore(state => state.addService);
  const setNavVisibility = useNavigationStore(state => state.setNavVisibility);
  
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [activePeriod, setActivePeriod] = useState<'час' | 'день' | 'месяц'>('час');

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNavVisibility(false);
      if (drawerRef.current) disableBodyScroll(drawerRef.current);
    } else {
      setNavVisibility(true);
      clearAllBodyScrollLocks();
    }
    return () => { setNavVisibility(true); clearAllBodyScrollLocks(); };
  }, [isOpen, setNavVisibility]);

  const handleSave = () => {
    if (!title.trim() || !price) return;
    addService({
      id: Math.floor(Math.random() * 100000).toString(),
      date: new Date().toLocaleString('ru-RU').replace(',', ''),
      title,
      price,
      deposit: deposit || '0',
      period: activePeriod,
      isActive: true,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-[4px]"
          />
          <motion.div
            ref={drawerRef}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed bottom-0 left-0 right-0 bg-white z-[201] rounded-t-[32px] flex flex-col max-h-[92vh] shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 shrink-0" />
            
            <div className="px-6 py-4 flex justify-between items-center shrink-0">
              <h2 className="text-[22px] font-black text-[#1A1A1A] tracking-tight">Добавление услуги</h2>
              <button onClick={onClose} className="w-10 h-10 bg-[#F4F5F7] flex items-center justify-center rounded-full active:scale-90 transition-all">
                <X size={22} className="text-[#1A1A1A]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 no-scrollbar space-y-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#999999] ml-4 uppercase tracking-widest">Название услуги</label>
                <input
                  type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="Сдаем комнаты посуточно"
                  className="w-full h-[56px] border-2 border-[#F4F5F7] rounded-[18px] px-5 text-[16px] font-bold text-[#1A1A1A] outline-none focus:border-[#573DEB]/30 transition-all placeholder:font-medium placeholder:text-[#BBBBBB]"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[11px] font-bold text-[#999999] ml-4 uppercase tracking-widest">Стоимость</label>
                  <div className="relative">
                    <input
                      type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0"
                      className="w-full h-[56px] border-2 border-[#F4F5F7] rounded-[18px] px-5 text-[16px] font-bold text-[#1A1A1A] outline-none focus:border-[#573DEB]/30 transition-all"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#999999] font-bold">₽</span>
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-[11px] font-bold text-[#999999] ml-4 uppercase tracking-widest">Залог</label>
                  <div className="relative">
                    <input
                      type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="0"
                      className="w-full h-[56px] border-2 border-[#F4F5F7] rounded-[18px] px-5 text-[16px] font-bold text-[#1A1A1A] outline-none focus:border-[#573DEB]/30 transition-all"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#999999] font-bold">₽</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 bg-[#F4F5F7] p-1.5 rounded-[18px]">
                {PERIODS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setActivePeriod(p.value)}
                    className={cn(
                      "flex-1 h-[42px] rounded-[14px] text-[14px] font-bold transition-all",
                      activePeriod === p.value ? "bg-[#573DEB] text-white shadow-sm" : "text-[#1A1A1A]"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 shrink-0 border-t border-gray-50 pb-10">
              <button 
                onClick={handleSave}
                disabled={!title.trim() || !price}
                className="w-full h-[58px] bg-[#573DEB] disabled:bg-[#EEEDFC] disabled:text-[#573DEB]/40 text-white font-black text-[16px] rounded-[22px] shadow-[0_10px_28px_rgba(87,61,235,0.3)] active:scale-[0.97] transition-all"
              >
                Добавить
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};