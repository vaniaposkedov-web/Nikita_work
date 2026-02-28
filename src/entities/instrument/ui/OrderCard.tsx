'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, RotateCcw } from 'lucide-react';
import { cn } from "@/shared/lib/utils";

export type OrderStatus = 'paid' | 'unpaid' | 'partial' | 'completed';

export interface OrderPayload {
  id: string;
  date: string;
  customer: string;
  item: string;
  phone: string;
  returnDate: string;
  price: string;
  deposit: string;
  status: OrderStatus;
}

interface OrderCardProps {
  order: OrderPayload;
  onComplete?: (order: OrderPayload) => void; // <-- НОВЫЙ ПРОП
}

const STATUS_CONFIG: Record<OrderStatus, { label: string, color: string, bg: string }> = {
  paid: { label: 'Оплачен полностью', color: '#FFFFFF', bg: '#00D166' },
  unpaid: { label: 'Не оплачен', color: '#FFFFFF', bg: '#FF4747' },
  partial: { label: 'Оплачен частично', color: '#FFFFFF', bg: '#FF8A00' },
  completed: { label: 'Завершен', color: '#FFFFFF', bg: '#00A3FF' },
};

export const OrderCard = ({ order, onComplete }: OrderCardProps) => {
  const status = STATUS_CONFIG[order.status];
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div className="bg-white rounded-[24px] p-4 flex flex-col relative transition-transform">
      <div className="self-start mb-2">
        <div 
          className="px-3 py-1.5 rounded-full text-[13px] font-medium tracking-wide"
          style={{ backgroundColor: status.bg, color: status.color }}
        >
          {status.label}
        </div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <div className="text-[13px] text-[#999999] font-medium">
          ID:{order.id} <span className="mx-1">•</span> {order.date}
        </div>
        
       <div className="relative" ref={menuRef}>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={cn(
              "p-2 rounded-full transition-colors -mr-2",
              isMenuOpen ? "bg-gray-100 text-[#1A1A1A]" : "text-[#1A1A1A] hover:bg-gray-50"
            )}
          >
            <MoreHorizontal size={20} />
          </motion.button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-[110%] w-[210px] bg-white rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[#F0F0F0] z-20 py-1.5 overflow-hidden"
              >
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-black/5 transition-colors text-left"
                >
                  <RotateCcw size={16} className="text-[#1A1A1A]" />
                  <span className="text-[14px] font-medium text-[#1A1A1A]">Повторить заказ</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-1.5 mb-4">
        <h3 className="font-medium text-[15px] text-[#1A1A1A] leading-tight">{order.customer}</h3>
        <p className="text-[15px] text-[#1A1A1A]">{order.item}</p>
        <p className="text-[15px] text-[#1A1A1A]">{order.phone}</p>
        <p className="text-[14px] text-[#1A1A1A] mt-1">
          {order.returnDate}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="bg-white border border-[#F0F0F0] rounded-full px-3 py-1.5 flex items-center">
          <span className="text-[14px] text-[#1A1A1A] font-medium">Услуга: {order.price} / час</span>
        </div>
        <div className="bg-white border border-[#F0F0F0] rounded-full px-3 py-1.5 flex items-center">
          <span className="text-[14px] text-[#1A1A1A] font-medium">Залог: {order.deposit} ₽</span>
        </div>
      </div>

      <button 
        onClick={() => onComplete?.(order)} // <-- ВЫЗОВ КОЛЛБЕКА
        className="w-full h-[52px] bg-white border border-[#F0F0F0] rounded-[16px] font-medium text-[15px] text-[#1A1A1A] active:bg-gray-50 transition-colors"
      >
        Завершить заказ
      </button>
    </div>
  );
};