'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; }

export const CreateOrderDrawer = ({ isOpen, onClose }: Props) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} 
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-[2px]" />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[101] p-6 pb-12 shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[20px] font-black">Новый заказ</h2>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-400 ml-1">Клиент</label>
                <input className="w-full h-[56px] bg-gray-50 rounded-[18px] px-4 font-medium" placeholder="ФИО клиента" />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-gray-400 ml-1">Инструмент</label>
                <select className="w-full h-[56px] bg-gray-50 rounded-[18px] px-4 font-medium outline-none appearance-none">
                  <option>Выберите инструмент</option>
                </select>
              </div>
              <button className="w-full h-[56px] bg-[#573DEB] rounded-[20px] text-white font-black text-[16px] shadow-lg active:scale-[0.97] transition-all">
                Создать заказ
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};