'use client';

import React, { useState } from 'react';
import { ChevronRight, Link2, Code, Smartphone, Grid, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { HelpSelectionModal } from "@/features/help-selection/ui/HelpSelectionModal";

const ADD_INSTRUMENTS = [
  {
    id: 'pay-link',
    title: 'PAY-LINK',
    description: 'Платёжная ссылка в сообщениях и соцсетях',
    badge: 'Для отправки клиентам',
    icon: <Link2 size={24} strokeWidth={2.5} />,
    gradient: 'from-[#41EB86] to-[#44B5FE]',
  },
  {
    id: 'api',
    title: 'API',
    description: 'Интеграция оплаты на ваш сайт или в приложение',
    badge: 'Для онлайн-продаж',
    icon: <Code size={24} strokeWidth={2.5} />,
    gradient: 'from-[#FEAB77] to-[#FE7777]',
  },
  {
    id: 'qr-pos',
    title: 'QR-POS',
    description: 'Принимайте платежи через смартфон, как в магазине',
    badge: 'Для живых продаж',
    icon: <Smartphone size={24} strokeWidth={2.5} />,
    gradient: 'from-[#6877E1] to-[#44B5FE]',
  },
  {
    id: 'qr-code',
    title: 'QR-CODE',
    description: 'QR-код для печати и размещения на витрине',
    badge: 'Для фиксированных мест',
    icon: <Grid size={24} strokeWidth={2.5} />,
    gradient: 'from-[#0AE9FE] to-[#44B5FE]',
  },
  {
    id: 'rent',
    title: 'RENT',
    description: 'Аренда с залогом, бронирование и предоплата',
    badge: 'Для аренды и залогов',
    icon: <Key size={24} strokeWidth={2.5} />,
    gradient: 'from-[#EDE24B] to-[#FF9E61]',
  }
];

export const AddInstrumentSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="flex flex-col gap-[32px] pt-6 pb-24">
      <h2 className="w-[343px] h-[32px] text-[24px] font-semibold leading-[32px] tracking-[-0.02em] text-black">
        Добавление инструмента
      </h2>

      <div className="flex flex-col gap-8">
        {ADD_INSTRUMENTS.map((item) => (
          <motion.div 
            key={item.id} 
            whileTap={{ scale: 0.98 }}
            className="relative group cursor-pointer w-full"
          >
            {/* Badge: Small variant из Figma (Height 24px, Padding 4/10) */}
            <div className="absolute -top-3 right-4 z-20">
              <div className="bg-white h-6 px-[10px] flex items-center justify-center rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.04)] border border-black/[0.03]">
                <span className="text-[10px] font-semibold text-[#1A1A1A] leading-none uppercase tracking-wider">
                  {item.badge}
                </span>
              </div>
            </div>

            {/* Card: Растянута на 100% (w-full), высота 80px */}
            <div className="relative w-full h-[80px] rounded-[20px] border border-white/60 bg-white/50 backdrop-blur-[12px] overflow-hidden flex items-center p-[12px] gap-[12px] transition-colors group-hover:bg-white/60">
              
              {/* Icon Container 48x48 */}
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br text-white shadow-sm",
                item.gradient
              )}>
                {item.icon}
              </div>
              
              {/* Text Block */}
              <div className="flex flex-col flex-1 min-w-0">
                <h4 className="text-[16px] font-bold text-[#1A1A1A] tracking-tight leading-none mb-1 uppercase">
                  {item.title}
                </h4>
                <p className="text-[12px] text-[#838383] font-normal leading-[1.2] line-clamp-2 pr-4">
                  {item.description}
                </p>
              </div>

              {/* Arrow Icon */}
              <div className="text-[#838383]/40 pr-1 transition-colors group-hover:text-[#1A1A1A]">
                <ChevronRight size={24} strokeWidth={2} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Кнопка помощи */}
      <div className="flex justify-center mt-2">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center h-[36px] gap-2 bg-white/50 backdrop-blur-[12px] border border-white/50 px-[12px] rounded-full shadow-sm active:scale-95 transition-all cursor-pointer hover:bg-white/70"
        >
          <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
             <span className="text-white text-[12px] font-bold mb-[0.5px]">?</span>
          </div>
          <span className="text-[14px] font-medium text-[#1A1A1A] tracking-[-0.02em]">
            Не знаете, что выбрать?
          </span>
        </button>
      </div>

      <HelpSelectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
};