'use client';

import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, LayoutGrid, Key } from 'lucide-react';
import { cn } from "@/shared/lib/utils";
import { useInstrumentStore } from "@/shared/store/useInstrumentStore";
import { InstrumentCard } from "@/entities/instrument/ui/InstrumentCard";

// --- КАСТОМНЫЕ ИКОНКИ ИЗ FIGMA ---
const PayLinkIcon = ({ size = 20, className }: { size?: number | string, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M13.1742 9.32592C11.8837 8.03543 9.81093 8.00323 8.48189 9.22934C8.14362 9.54141 7.61641 9.52017 7.30433 9.1819C6.99226 8.84363 7.0135 8.31642 7.35177 8.00434C9.3355 6.17425 12.4272 6.22193 14.3527 8.14741C16.3271 10.1218 16.3271 13.3229 14.3527 15.2973L11.9642 17.6858C9.98978 19.6602 6.78867 19.6602 4.81428 17.6858C2.8399 15.7114 2.8399 12.5103 4.81428 10.536L5.20124 10.149C5.52668 9.82356 6.05431 9.82356 6.37975 10.149C6.70519 10.4744 6.70519 11.0021 6.37975 11.3275L5.9928 11.7145C4.66929 13.038 4.66929 15.1838 5.9928 16.5073C7.31631 17.8308 9.46214 17.8308 10.7857 16.5073L13.1742 14.1188C14.4977 12.7953 14.4977 10.6494 13.1742 9.32592Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M14.0077 3.49255C12.6842 2.16904 10.5383 2.16904 9.21484 3.49255L6.82629 5.8811C5.50278 7.20461 5.50278 9.35044 6.82629 10.674C8.11679 11.9644 10.1896 11.9966 11.5186 10.7705C11.8569 10.4585 12.3841 10.4797 12.6962 10.818C13.0082 11.1562 12.987 11.6835 12.6487 11.9955C10.665 13.8256 7.57326 13.7779 5.64778 11.8525C3.6734 9.87808 3.6734 6.67697 5.64778 4.70259L8.03633 2.31404C10.0107 0.339656 13.2118 0.339656 15.1862 2.31404C17.1606 4.28842 17.1606 7.48953 15.1862 9.46392L14.7993 9.85087C14.4738 10.1763 13.9462 10.1763 13.6207 9.85087C13.2953 9.52544 13.2953 8.9978 13.6207 8.67236L14.0077 8.28541C15.3312 6.9619 15.3312 4.81606 14.0077 3.49255Z" fill="currentColor"/>
  </svg>
);

const ApiIcon = ({ className }: { size?: number | string, className?: string }) => (
  // Контейнер строго 20x20
  <div className={cn("relative w-[20px] h-[20px] shrink-0", className)}>
    {/* Сама иконка 17.08x17.08 с позиционированием 1.46px */}
    <svg 
      style={{ 
        position: 'absolute', 
        top: '1.46px', 
        left: '1.46px', 
        width: '17.08px', 
        height: '17.08px' 
      }} 
      viewBox="0 0 18 18" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M8.58984 2.08616e-07C10.4153 -1.09076e-05 11.8493 -0.000118256 12.9688 0.150391C14.1159 0.304633 15.0261 0.62762 15.7412 1.34277C16.4564 2.05793 16.7794 2.96804 16.9336 4.11523C17.0841 5.23471 17.084 6.66865 17.084 8.49414V8.58984C17.084 10.4153 17.0841 11.8493 16.9336 12.9688C16.7794 14.1159 16.4564 15.0261 15.7412 15.7412C15.0261 16.4564 14.1159 16.7794 12.9688 16.9336C11.8493 17.0841 10.4153 17.084 8.58984 17.084H8.49414C6.66865 17.084 5.23471 17.0841 4.11523 16.9336C2.96804 16.7794 2.05793 16.4564 1.34277 15.7412C0.62762 15.0261 0.304633 14.1159 0.150391 12.9688C-0.000118256 11.8493 -1.09076e-05 10.4153 2.08616e-07 8.58984V8.49414C-1.09076e-05 6.66865 -0.000118256 5.23471 0.150391 4.11523C0.304633 2.96804 0.627619 2.05793 1.34277 1.34277C2.05793 0.627619 2.96804 0.304633 4.11523 0.150391C5.23471 -0.000118256 6.66865 -1.09076e-05 8.49414 2.08616e-07H8.58984ZM9.63867 5.25195C9.20224 5.10664 8.7306 5.342 8.58496 5.77832L6.91797 10.7783C6.77243 11.2149 7.00869 11.6875 7.44531 11.833C7.88191 11.9785 8.35346 11.7422 8.49902 11.3057L10.166 6.30566C10.3115 5.86906 10.0753 5.39749 9.63867 5.25195ZM5.83984 6.33105C5.53941 5.98266 5.01361 5.94393 4.66504 6.24414L3.64258 7.125C3.63233 7.13383 3.62165 7.14247 3.61133 7.15137C3.4238 7.31288 3.22479 7.48483 3.0791 7.64941C2.91438 7.83551 2.70899 8.13085 2.70898 8.54199C2.70898 8.95313 2.91438 9.24848 3.0791 9.43457C3.22479 9.59916 3.4238 9.7711 3.61133 9.93262C3.62166 9.94151 3.63233 9.95015 3.64258 9.95898L4.66504 10.8398C5.01361 11.1401 5.53941 11.1013 5.83984 10.7529C6.14032 10.4043 6.10154 9.87763 5.75293 9.57715L4.73047 8.69629C4.66266 8.63784 4.60433 8.58723 4.55273 8.54199C4.60433 8.49675 4.66266 8.44614 4.73047 8.3877L5.75293 7.50684C6.10154 7.20636 6.14032 6.67967 5.83984 6.33105ZM12.4189 6.24414C12.0704 5.94393 11.5446 5.98266 11.2441 6.33105C10.9437 6.67967 10.9824 7.20636 11.3311 7.50684L12.3535 8.3877C12.4213 8.44614 12.4797 8.49675 12.5312 8.54199C12.4797 8.58723 12.4213 8.63784 12.3535 8.69629L11.3311 9.57715C10.9824 9.87763 10.9437 10.4043 11.2441 10.7529C11.5446 11.1013 12.0704 11.1401 12.4189 10.8398L13.4414 9.95898C13.4517 9.95015 13.4623 9.94151 13.4727 9.93262C13.6602 9.7711 13.8592 9.59916 14.0049 9.43457C14.1696 9.24848 14.375 8.95313 14.375 8.54199C14.375 8.13085 14.1696 7.83551 14.0049 7.64941C13.8592 7.48483 13.6602 7.31288 13.4727 7.15137C13.4623 7.14247 13.4517 7.13383 13.4414 7.125L12.4189 6.24414Z" fill="currentColor"/>
    </svg>
  </div>
);
const TABS = [
  { label: 'Все', value: 'ALL' },
  { label: 'Платежная ссылка', value: 'PAY-LINK', icon: PayLinkIcon },
  { label: 'API', value: 'API', icon: ApiIcon },
  { label: 'QR-POS', value: 'QR-POS', icon: Smartphone },
  { label: 'QR-CODE', value: 'QR-CODE', icon: LayoutGrid },
  { label: 'Заказы с залогом', value: 'DEPOSIT', icon: Key },
];

/**
 * Оптимизированный хук для Drag-to-scroll
 */
function useDraggableScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const isDragged = useRef(false);

  const stopDragging = useCallback(() => {
    isDragging.current = false;
    if (ref.current) {
      ref.current.style.scrollSnapType = '';
      ref.current.style.cursor = 'grab';
    }
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging.current) stopDragging();
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [stopDragging]);

  const onMouseDown = (e: React.MouseEvent<T>) => {
    if (!ref.current) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    isDragging.current = true;
    isDragged.current = false;
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeftStart.current = ref.current.scrollLeft;
    
    ref.current.style.scrollSnapType = 'none';
    ref.current.style.cursor = 'grabbing';
  };

  const onMouseMove = (e: React.MouseEvent<T>) => {
    if (!isDragging.current || !ref.current) return;
    
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    
    if (Math.abs(walk) > 3) {
      isDragged.current = true;
      ref.current.scrollLeft = scrollLeftStart.current - walk;
    }
  };

  const onClickCapture = (e: React.MouseEvent<T>) => {
    if (isDragged.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return { ref, onMouseDown, onMouseLeave: stopDragging, onMouseUp: stopDragging, onMouseMove, onClickCapture };
}

export const MyInstrumentsSection = () => {
  const { instruments, filter, setFilter } = useInstrumentStore();
  const tabsScrollProps = useDraggableScroll<HTMLDivElement>();
  const cardsScrollProps = useDraggableScroll<HTMLDivElement>();

  const filteredInstruments = useMemo(() => {
    return instruments.filter(inst => filter === 'ALL' || inst.type === (filter as string));
  }, [instruments, filter]);

  const instrumentGroups = useMemo(() => {
    const displayInstruments = [
      ...filteredInstruments,
      ...filteredInstruments.map(item => ({ ...item, id: `${item.id}-copy1` })),
      ...filteredInstruments.map(item => ({ ...item, id: `${item.id}-copy2` })),
      ...filteredInstruments.map(item => ({ ...item, id: `${item.id}-copy3` }))
    ].slice(0, 12);

    const chunks = [];
    for (let i = 0; i < displayInstruments.length; i += 3) {
      chunks.push(displayInstruments.slice(i, i + 3));
    }
    return chunks;
  }, [filteredInstruments]);

  return (
    <section className="space-y-[16px] overflow-hidden relative -mx-[16px]">
      <div className="px-[16px] relative flex items-center">
        <h2 className="text-[24px] font-semibold leading-[32px] tracking-[-0.02em] text-black">
          Мои инструменты
        </h2>
      </div>

      {/* TABS */}
      <div 
        {...tabsScrollProps} 
        className="flex gap-[8px] overflow-x-auto px-[16px] pb-1 snap-x scroll-px-[16px] no-scrollbar cursor-grab active:cursor-grabbing touch-pan-x select-none"
      >
        {TABS.map((tab) => {
          const isActive = (filter as string) === tab.value;
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              className={cn(
                "flex items-center justify-center h-[36px] px-[12px] py-[8px] gap-[4px] rounded-full transition-all shrink-0 snap-start active:scale-95",
                // Новые шрифтовые стили для всех табов
                "text-[14px] font-medium leading-[20px] tracking-[-0.02em]", 
                isActive 
                  ? "bg-[#573DEB] text-white shadow-md border border-transparent" 
                  : "bg-white/50 text-black border-[1px] border-white/60 backdrop-blur-[12px]"
              )}
            >
              {Icon && <Icon size={20} strokeWidth={2.5} className="shrink-0" />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CARDS */}
      <div 
        {...cardsScrollProps} 
        className="flex gap-[12px] overflow-x-auto snap-x snap-mandatory px-[16px] scroll-px-[16px] pb-2 no-scrollbar cursor-grab active:cursor-grabbing touch-pan-x select-none"
      >
        <AnimatePresence mode="popLayout">
          {instrumentGroups.map((group, groupIndex) => (
            <motion.div
              key={`group-${groupIndex}-${filter}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-[8px] shrink-0 snap-start w-[calc(100vw-110px)] max-w-[280px]"
            >
              {group.map((inst) => <InstrumentCard key={inst.id} data={inst} />)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};