'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import boxImg from "@/assets/box.png";

interface EmptyStateProps {
  text: string;
  btnText?: string; // Сделали опциональным
  onAdd?: () => void; // Сделали опциональным
}

export const EmptyState = ({ text, btnText, onAdd }: EmptyStateProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-12 w-full px-5"
  >
    <div className="relative w-[160px] h-[160px] flex items-center justify-center mb-4">
      <Image 
        src={boxImg} 
        alt="Empty state" 
        width={140} 
        height={140} 
        className="object-contain opacity-20 grayscale" 
      />
    </div>
    
    <p className="text-[#999999] text-[15px] leading-[22px] text-center font-medium mb-8 max-w-[240px] whitespace-pre-line">
      {text}
    </p>

    {/* Рендерим кнопку только если переданы пропсы */}
    {onAdd && btnText && (
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onAdd}
        className="flex items-center justify-center px-8 h-[52px] bg-[#573DEB] rounded-[26px] text-white font-bold text-[15px] shadow-[0_10px_25px_rgba(87,61,235,0.3)] transition-all"
      >
        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-3 shrink-0">
          <Plus size={16} className="text-[#573DEB]" strokeWidth={3} />
        </div>
        {btnText}
      </motion.button>
    )}
  </motion.div>
);