'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Link2, Code, Smartphone, Grid, Key } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/shared/lib/utils';

interface HelpSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HELP_ITEMS = [
  {
    id: 'help-pay-link',
    title: 'PAY-LINK - Если клиенты далеко',
    description: 'Отправляете платёжную ссылку в сообщении, email или соцсетях. Клиент переходит и оплачивает онлайн.',
    target: 'Вы: онлайн-консультант, репетитор, фрилансер, доставка, продажи в соцсетях',
    icon: <Link2 size={20} />,
    gradient: 'from-[#41EB86] to-[#44B5FE]',
  },
  {
    id: 'help-api',
    title: 'API - Если у вас свой сайт/приложение',
    description: 'Встраиваете приём платежей в свой сайт, мобильное приложение или CRM-систему.',
    target: 'Вы: интернет-магазин, SaaS-сервис, разработчик, IT-компания',
    icon: <Code size={20} />,
    gradient: 'from-[#FEAB77] to-[#FE7777]',
  },
  {
    id: 'help-qr-pos',
    title: 'QR-POS - Если вы продаете лично',
    description: 'Ваш смартфон становится платежным терминалом. Показываете клиенту QR-код на экране, он сканирует и оплачивает.',
    target: 'Вы: продавец на рынке, курьер, мастер на выезде, таксист, официант',
    icon: <Smartphone size={20} />,
    gradient: 'from-[#6877E1] to-[#44B5FE]',
  },
  {
    id: 'help-qr-code',
    title: 'QR-CODE - Если у вас постоянное место',
    description: 'Создаёте один QR-код, распечатываете и размещаете на витрине, столе, в кафе. Клиенты сканируют и платят.',
    target: 'Вы: магазин, кафе, салон красоты, выставка, фитнес-клуб, арендодатель',
    icon: <Grid size={20} />,
    gradient: 'from-[#0AE9FE] to-[#44B5FE]',
  },
  {
    id: 'help-rent',
    title: 'RENT - Если сдаёте в аренду',
    description: 'Система аренды с залогом, бронированием и предоплатой. Автоматические возвраты залогов.',
    target: 'Вы: аренда жилья, прокат техники, коворкинг, парковка, спортинвентарь',
    icon: <Key size={20} />,
    gradient: 'from-[#EDE24B] to-[#FF9E61]',
  }
];

export const HelpSelectionModal = ({ isOpen, onClose }: HelpSelectionModalProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal forceMount>
        <AnimatePresence>
          {isOpen && (
            <>
              <Dialog.Overlay asChild key="overlay">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" 
                />
              </Dialog.Overlay>
              
              <Dialog.Content asChild key="content">
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto bg-white rounded-t-[32px] max-h-[92vh] flex flex-col z-[101] shadow-2xl focus:outline-none"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center px-6 py-5 sticky top-0 bg-white rounded-t-[32px] z-10">
                    <div className="flex flex-col">
                      <Dialog.Title className="text-[20px] font-bold text-[#1A1A1A] tracking-tight">
                        Какой инструмент выбрать?
                      </Dialog.Title>
                      
                      {/* --- ИСПРАВЛЕНИЕ: Добавляем описание для Accessibility --- */}
                      <Dialog.Description className="sr-only">
                        Подробное руководство по выбору платежных инструментов MOWAY на основе вашего типа бизнеса.
                      </Dialog.Description>
                    </div>

                    <Dialog.Close asChild>
                      <button className="p-2 text-[#838383] hover:text-[#1A1A1A] transition-colors cursor-pointer">
                        <X size={24} />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4 no-scrollbar">
                    {HELP_ITEMS.map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-[#F9F9F9] rounded-[12px] p-4 flex flex-col items-center text-center gap-3 border border-black/[0.02]"
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-br shadow-sm",
                          item.gradient
                        )}>
                          {item.icon}
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-[16px] font-semibold text-[#1A1A1A] tracking-tight">
                            {item.title}
                          </h4>
                          <p className="text-[14px] text-[#838383] leading-[1.4]">
                            {item.description}
                          </p>
                        </div>

                        <div className="w-full bg-white rounded-[8px] py-3 px-4 border border-black/[0.03]">
                          <p className="text-[12px] text-[#573DEB] font-normal leading-tight">
                            {item.target}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Button */}
                  <div className="px-6 py-5 bg-white border-t border-black/[0.03]">
                    <Dialog.Close asChild>
                      <button className="w-full h-[54px] bg-[#F2F2F2] hover:bg-[#EAEAEA] text-[#1A1A1A] font-bold rounded-[16px] transition-colors cursor-pointer">
                        Закрыть
                      </button>
                    </Dialog.Close>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};