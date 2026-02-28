'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IInstrument } from '../model/types';
import { InstrumentActions } from '@/features/manage-instrument/ui/InstrumentActions';
import { cn } from '@/shared/lib/utils';

interface InstrumentCardProps {
  data: IInstrument;
  className?: string;
}

export const InstrumentCard = ({ data, className }: InstrumentCardProps) => {
  return (
    <motion.div 
      layout
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative flex items-center justify-between h-[64px] w-full shrink-0 rounded-[20px] p-[12px] cursor-pointer transition-shadow",
        "bg-white/50 backdrop-blur-[12px] border-[1px] border-white/60",
        className
      )}
    >
      <div className="flex flex-col justify-center min-w-0 pr-2">
        {/* Подзаголовок (QR-POS и т.д.): h=16, 12px, Regular, 16px line-height, -2% tracking, цвет #838383 */}
        <div className="flex items-center gap-[4px] text-[#838383] text-[12px] font-normal leading-[16px] tracking-[-0.02em] h-[16px] overflow-hidden whitespace-nowrap">
          <span className="truncate">{data.type}</span>
          <span>·</span>
          <span className="truncate">ID:{data.externalId}</span>
        </div>
        
        {/* Заголовок (Точка на рынке): w=104, h=20, 14px, Medium, 20px line-height, -2% tracking, цвет #1A1A1A */}
        <h4 className="text-[#1A1A1A] text-[14px] font-medium leading-[20px] tracking-[-0.02em] w-[104px] h-[20px] mt-[2px] truncate">
          {data.title}
        </h4>
      </div>

      <div className="shrink-0 relative z-10">
        <InstrumentActions id={data.id} />
      </div>
    </motion.div>
  );
};