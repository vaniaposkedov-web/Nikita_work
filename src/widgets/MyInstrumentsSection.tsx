'use client';

import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Smartphone, LayoutGrid, Key } from 'lucide-react';
import { cn } from "@/shared/lib/utils";
import { useInstrumentStore } from "@/shared/store/useInstrumentStore";
import { InstrumentCard } from "@/entities/instrument/ui/InstrumentCard";

const TABS = [
  { label: 'Все', value: 'ALL' },
  { label: 'Платежная ссылка', value: 'PAY-LINK', icon: Link2 },
  { label: 'API', value: 'API', icon: 'API_CUSTOM' },
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
    // Предотвращаем драг для тач-событий, чтобы не мешать нативному скроллу
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
    const walk = (x - startX.current) * 1.5; // Чуть снизили множитель для плавности
    
    if (Math.abs(walk) > 3) {
      isDragged.current = true;
      // Используем requestAnimationFrame для высокопроизводительного скролла
      ref.current.scrollLeft = scrollLeftStart.current - walk;
    }
  };

  const onClickCapture = (e: React.MouseEvent<T>) => {
    // Если был зафиксирован драг, блокируем клик по карточке
    if (isDragged.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return { 
    ref, 
    onMouseDown, 
    onMouseLeave: stopDragging, 
    onMouseUp: stopDragging, 
    onMouseMove, 
    onClickCapture 
  };
}

export const MyInstrumentsSection = () => {
  const { instruments, filter, setFilter } = useInstrumentStore();
  const tabsScrollProps = useDraggableScroll<HTMLDivElement>();
  const cardsScrollProps = useDraggableScroll<HTMLDivElement>();

  const filteredInstruments = useMemo(() => {
    return instruments.filter(inst => filter === 'ALL' || inst.type === (filter as string));
  }, [instruments, filter]);

  const instrumentGroups = useMemo(() => {
    // Ограничиваем до 12 элементов, как в твоем конфиге
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
    <section className="space-y-[16px] overflow-hidden relative">
      <div className="px-5 relative flex items-center">
        <h2 className="text-[20px] font-bold text-[#1A1A1A] tracking-tight">
          Мои инструменты
        </h2>
      </div>

      {/* TABS */}
      <div 
        {...tabsScrollProps} 
        className="flex gap-[8px] overflow-x-auto px-5 pb-1 snap-x scroll-px-5 no-scrollbar cursor-grab active:cursor-grabbing touch-pan-x select-none"
      >
        {TABS.map((tab) => {
          const isActive = (filter as string) === tab.value;
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              className={cn(
                "flex items-center justify-center h-[32px] px-[16px] rounded-full text-[13px] font-bold transition-all shrink-0 snap-start active:scale-95",
                isActive ? "bg-[#573DEB] text-white shadow-md" : "bg-white text-[#1A1A1A] shadow-sm hover:bg-gray-50"
              )}
            >
              {Icon === 'API_CUSTOM' ? (
                <div className={cn("w-[18px] h-[18px] rounded-[4px] flex items-center justify-center mr-[6px]", isActive ? "bg-white" : "bg-[#1A1A1A]")}>
                  <span className={cn("text-[9px] font-black leading-none", isActive ? "text-[#573DEB]" : "text-white")}>{"</>"}</span>
                </div>
              ) : Icon ? <Icon size={16} strokeWidth={2.5} className="mr-[6px]" /> : null}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CARDS */}
      <div 
        {...cardsScrollProps} 
        className="flex gap-[12px] overflow-x-auto snap-x snap-mandatory px-5 pb-2 no-scrollbar cursor-grab active:cursor-grabbing touch-pan-x select-none"
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