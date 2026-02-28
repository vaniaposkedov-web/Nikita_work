'use client';

import React from 'react';
import { Home, BarChart3, FileText, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { useNavigationStore } from '@/shared/store/useNavigationStore';

const TABS = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'stats', label: 'Статистика', icon: BarChart3 },
  { id: 'docs', label: 'Документы', icon: FileText },
  { id: 'help', label: 'Помощь', icon: HelpCircle },
];

export const BottomNav = () => {
  const { activeTab, setActiveTab, isNavVisible } = useNavigationStore();

  return (
    <AnimatePresence>
      {isNavVisible && (
        <motion.nav 
          initial={{ y: 100, x: '-50%', opacity: 0 }}
          animate={{ y: 0, x: '-50%', opacity: 1 }}
          exit={{ y: 100, x: '-50%', opacity: 0 }}
          className="fixed bottom-6 left-1/2 z-50"
        >
          <div className="w-[319px] h-[62px] bg-white/80 backdrop-blur-[12px] border border-white/50 rounded-[296px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-between px-[6px]">
            <LayoutGroup>
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative h-full flex-1 flex flex-col items-center justify-center cursor-pointer outline-none"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-y-[4px] inset-x-[2px] bg-[#F5F3FE] rounded-[100px] z-0"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className={cn(
                      "relative z-10 flex flex-col items-center gap-0.5 transition-colors duration-300",
                      isActive ? "text-[#573DEB]" : "text-[#838383]"
                    )}>
                      <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="text-[10px] font-bold tracking-tight uppercase">{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </LayoutGroup>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};