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
        "group relative flex items-center justify-between h-[64px] w-full shrink-0 rounded-[20px] px-[16px] cursor-pointer transition-shadow",
        "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]",
        className
      )}
    >
      <div className="flex flex-col justify-center min-w-0 pr-2">
        <div className="flex items-center gap-[4px] text-[#838383] text-[10px] font-medium uppercase tracking-wider overflow-hidden whitespace-nowrap">
          <span>{data.type}</span>
          <span className="text-[10px]">·</span>
          <span className="truncate">ID:{data.externalId}</span>
          <span className="text-[10px]">·</span>
          <span>{data.date}</span>
        </div>
        <h4 className="text-[#1A1A1A] text-[15px] font-bold tracking-[-0.01em] mt-[2px] truncate">
          {data.title}
        </h4>
      </div>

      <div className="shrink-0 relative z-10">
        <InstrumentActions id={data.id} />
      </div>
    </motion.div>
  );
};