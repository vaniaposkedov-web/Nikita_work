'use client';

import React from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { useNavigationStore } from '@/shared/store/useNavigationStore';

// --- КАСТОМНЫЕ ИКОНКИ (24x24) ---
const HomeIcon = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M3.25 10.6868L2.69211 11.2218C2.29347 11.604 1.66045 11.5907 1.27821 11.1921C0.895967 10.7935 0.909258 10.1604 1.30789 9.77821L5.70301 5.56386C6.99217 4.32768 8.03207 3.33052 8.9598 2.6518C9.92464 1.94593 10.8777 1.5 12 1.5C13.1223 1.5 14.0754 1.94593 15.0402 2.6518C15.9679 3.33053 17.0078 4.32768 18.297 5.56387L22.6921 9.77821C23.0907 10.1604 23.104 10.7935 22.7218 11.1921C22.3396 11.5907 21.7065 11.604 21.3079 11.2218L20.75 10.6868V13.5565C20.75 15.3942 20.75 16.8498 20.5969 17.989C20.4392 19.1614 20.1071 20.1104 19.3588 20.8588C18.6104 21.6071 17.6614 21.9392 16.489 22.0969C15.3498 22.25 13.8942 22.25 12.0564 22.25H11.9435C10.1058 22.25 8.65018 22.25 7.51098 22.0969C6.33856 21.9392 5.38961 21.6071 4.64124 20.8588C3.89288 20.1104 3.56076 19.1614 3.40314 17.989C3.24997 16.8498 3.24999 15.3942 3.25 13.5564V13.5564V13.5564V10.6868ZM10.75 17C10.75 16.3096 11.3076 15.75 11.9955 15.75C12.6777 15.75 13.25 16.3117 13.25 17C13.25 17.6883 12.6777 18.25 11.9955 18.25C11.3076 18.25 10.75 17.6904 10.75 17Z" fill="currentColor"/>
  </svg>
);

const StatsIcon = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12.0576 1.75C14.2479 1.74999 15.9683 1.75012 17.3115 1.93066C18.6882 2.11575 19.7805 2.50313 20.6387 3.36133C21.4969 4.21953 21.8842 5.31182 22.0693 6.68848C22.2499 8.03174 22.25 9.75212 22.25 11.9424V12.0576C22.25 14.2479 22.2499 15.9683 22.0693 17.3115C21.8842 18.6882 21.4969 19.7805 20.6387 20.6387C19.7805 21.4969 18.6882 21.8842 17.3115 22.0693C15.9683 22.2499 14.2479 22.25 12.0576 22.25H11.9424C9.75212 22.25 8.03174 22.2499 6.68848 22.0693C5.31182 21.8842 4.21953 21.4969 3.36133 20.6387C2.50313 19.7805 2.11575 18.6882 1.93066 17.3115C1.75012 15.9683 1.74999 14.2479 1.75 12.0576V11.9424C1.74999 9.75212 1.75012 8.03174 1.93066 6.68848C2.11575 5.31182 2.50313 4.21953 3.36133 3.36133C4.21953 2.50313 5.31182 2.11575 6.68848 1.93066C8.03174 1.75012 9.75213 1.74999 11.9424 1.75H12.0576ZM7 12.25C6.58579 12.25 6.25 12.5858 6.25 13L6.25 17C6.25 17.4142 6.58579 17.75 7 17.75C7.41421 17.75 7.75 17.4142 7.75 17L7.75 13C7.75 12.5858 7.41421 12.25 7 12.25ZM12 6.25C11.5858 6.25 11.25 6.58579 11.25 7L11.25 17C11.25 17.4142 11.5858 17.75 12 17.75C12.4142 17.75 12.75 17.4142 12.75 17L12.75 7C12.75 6.58579 12.4142 6.25 12 6.25ZM17 10.25C16.5858 10.25 16.25 10.5858 16.25 11L16.25 17C16.25 17.4142 16.5858 17.75 17 17.75C17.4142 17.75 17.75 17.4142 17.75 17V11C17.75 10.5858 17.4142 10.25 17 10.25Z" fill="currentColor"/>
  </svg>
);

const DocsIcon = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M15.8002 2.20999C15.3902 1.79999 14.6802 2.07999 14.6802 2.64999V6.13999C14.6802 7.59999 15.9202 8.80999 17.4302 8.80999C18.3802 8.81999 19.7002 8.81999 20.8302 8.81999C21.4002 8.81999 21.7002 8.14999 21.3002 7.74999C19.8602 6.29999 17.2802 3.68999 15.8002 2.20999Z" fill="currentColor"/>
    <path d="M20.5 10.19H17.61C15.24 10.19 13.31 8.26 13.31 5.89V3C13.31 2.45 12.86 2 12.31 2H8.07C4.99 2 2.5 4 2.5 7.57V16.43C2.5 20 4.99 22 8.07 22H15.93C19.01 22 21.5 20 21.5 16.43V11.19C21.5 10.64 21.05 10.19 20.5 10.19ZM11.5 17.75H7.5C7.09 17.75 6.75 17.41 6.75 17C6.75 16.59 7.09 16.25 7.5 16.25H11.5C11.91 16.25 12.25 16.59 12.25 17C12.25 17.41 11.91 17.75 11.5 17.75ZM13.5 13.75H7.5C7.09 13.75 6.75 13.41 6.75 13C6.75 12.59 7.09 12.25 7.5 12.25H13.5C13.91 12.25 14.25 12.59 14.25 13C14.25 13.41 13.91 13.75 13.5 13.75Z" fill="currentColor"/>
  </svg>
);

const HelpIcon = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12C1.25 6.06294 6.06294 1.25 12 1.25ZM11.9951 15.5C11.4455 15.5002 11 15.9479 11 16.5C11 17.0521 11.4455 17.4998 11.9951 17.5H12.0049C12.5545 17.4998 13 17.0521 13 16.5C13 15.9479 12.5545 15.5002 12.0049 15.5H11.9951ZM12 6.5C10.3431 6.5 9 7.84315 9 9.5C9 10.0523 9.44771 10.5 10 10.5C10.5177 10.5 10.9438 10.1067 10.9951 9.60254L11.0049 9.39746C11.0562 8.89333 11.4823 8.5 12 8.5C12.5523 8.5 13 8.94772 13 9.5C13 9.70057 12.9416 9.88491 12.8418 10.04C12.7237 10.2234 12.5735 10.4168 12.3887 10.6465C12.3598 10.6824 12.3296 10.7198 12.2988 10.7578C12.1438 10.9495 11.9683 11.1662 11.8086 11.3857C11.4326 11.9026 11 12.6184 11 13.5C11 14.0523 11.4477 14.5 12 14.5C12.5523 14.5 13 14.0523 13 13.5C13 13.277 13.1097 12.9969 13.4258 12.5625C13.5528 12.3879 13.6904 12.2184 13.8447 12.0273C13.878 11.9862 13.9124 11.9438 13.9473 11.9004C14.1339 11.6685 14.3437 11.403 14.5244 11.1221C14.8257 10.6539 15 10.0957 15 9.5C15 7.84315 13.6569 6.5 12 6.5Z" fill="currentColor"/>
  </svg>
);

const TABS = [
  { id: 'home', label: 'Главная', icon: HomeIcon },
  { id: 'stats', label: 'Статистика', icon: StatsIcon },
  { id: 'docs', label: 'Документы', icon: DocsIcon },
  { id: 'help', label: 'Помощь', icon: HelpIcon },
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
          className="fixed bottom-6 left-1/2 z-50 pointer-events-none"
        >
          <div className="relative w-[319px] h-[62px] flex items-center justify-center pointer-events-auto">
            
            {/* 1. СЛОЙ BLUR (Внешний контейнер свечения 371x114) */}
            <div 
              className="absolute -top-[26px] -left-[26px] w-[371px] h-[114px] opacity-[0.67] pointer-events-none overflow-hidden"
              style={{ zIndex: -2 }}
            >
              <div 
                className="absolute top-[28px] left-[26px] w-[319px] h-[62px] rounded-[1000px] bg-black/[0.04] backdrop-blur-[40px]"
              />
            </div>

            {/* 2. ОСНОВНОЙ БЛОК (FILL LAYER) 319x62 */}
            <div 
              className="absolute inset-0 backdrop-blur-[12px] rounded-[296px]"
              style={{
                zIndex: -1,
                background: `
                  linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)) padding-box,
                  linear-gradient(93.5deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 50%, #FFFFFF 100%) border-box
                `,
                border: '1px solid transparent',
              }}
            />

            {/* 3. ГЛАВНЫЙ КОНТЕЙНЕР КНОПОК */}
            <div className="w-[311px] h-[54px] flex items-center justify-between px-[2px]">
              <LayoutGroup>
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="relative h-full flex-1 flex flex-col items-center justify-center cursor-pointer outline-none group"
                        >
                        {isActive && (
                          <motion.div
                            layoutId="active-pill"
                            // Поменяли bg-[#F5F3FE] на более светлый #FAF9FF
                            className="absolute w-[83.25px] h-[54px] bg-[#F5F3FE] rounded-[100px] z-0"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        
                        <div className={cn(
                          "relative z-10 flex flex-col items-center justify-center transition-colors duration-300",
                          // Цвет иконки (уже был реализован)
                          isActive ? "text-[#573DEB]" : "text-[#838383]"
                        )}>
                          <Icon size={24} className="shrink-0" />
                          <span 
                            className={cn(
                              "w-[67.25px] h-[12px] text-[10px] font-medium leading-[12px] tracking-[0px] text-center whitespace-nowrap mix-blend-plus-darker transition-colors duration-300",
                              // Добавили перекрашивание текста: фиолетовый при isActive, иначе темно-серый
                              isActive ? "text-[#573DEB]" : "text-[#4D4D4D]"
                            )}
                          >
                            {tab.label}
                          </span>
                        </div>
                      </button>
                  );
                })}
              </LayoutGroup>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};