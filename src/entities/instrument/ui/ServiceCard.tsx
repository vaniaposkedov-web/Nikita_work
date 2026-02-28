'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import { cn } from "@/shared/lib/utils";

export interface ServicePayload {
  id: string;
  date: string;
  title: string;
  price: string;
  deposit: string;
  period: 'час' | 'день' | 'месяц';
  isActive: boolean;
}

interface ServiceCardProps {
  service: ServicePayload;
  onEdit?: (service: ServicePayload) => void;
  onDelete?: (id: string) => void;
}

export const ServiceCard = ({ service, onEdit, onDelete }: ServiceCardProps) => {
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

  // Форматирование ценников с пробелами (2500 -> 2 500)
  const formattedPrice = parseInt(service.price).toLocaleString('ru-RU');
  const formattedDeposit = parseInt(service.deposit).toLocaleString('ru-RU');

  return (
    <div className="bg-white rounded-[24px] p-4 flex flex-col relative transition-transform">
      <div className="flex justify-between items-center mb-3">
        <div className="text-[13px] text-[#999999] font-medium">
          ID:{service.id} <span className="mx-1">•</span> {service.date}
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
                className="absolute right-0 top-[110%] w-[180px] bg-white rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[#F0F0F0] z-20 py-1.5 overflow-hidden"
              >
                <button 
                  onClick={() => { setIsMenuOpen(false); onEdit?.(service); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-black/5 transition-colors text-left"
                >
                  <Edit2 size={16} className="text-[#1A1A1A]" />
                  <span className="text-[14px] font-medium text-[#1A1A1A]">Редактировать</span>
                </button>
                <button 
                  onClick={() => { setIsMenuOpen(false); onDelete?.(service.id); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-left group"
                >
                  <Trash2 size={16} className="text-[#FF4747] group-active:scale-95 transition-transform" />
                  <span className="text-[14px] font-medium text-[#FF4747]">Удалить</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-1.5 mb-4">
        <h3 className="font-medium text-[15px] text-[#1A1A1A] leading-tight pr-6">
          {service.title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="bg-white border border-[#F0F0F0] rounded-full px-3 py-1.5 flex items-center">
          <span className="text-[14px] text-[#1A1A1A] font-medium">Услуга: {formattedPrice} ₽ / {service.period}</span>
        </div>
        <div className="bg-white border border-[#F0F0F0] rounded-full px-3 py-1.5 flex items-center">
          <span className="text-[14px] text-[#1A1A1A] font-medium">Залог: {formattedDeposit} ₽</span>
        </div>
      </div>
    </div>
  );
};