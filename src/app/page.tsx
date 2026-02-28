'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/shared/lib/utils';
import { TurnoverWidget } from "@/widgets/TurnoverWidget";
import { MyInstrumentsSection } from "@/widgets/MyInstrumentsSection";
import { AddInstrumentSection } from "@/widgets/AddInstrumentSection";
import { OrdersPage } from "@/widgets/OrdersPage";
import { Logo } from "@/shared/ui/Logo";
import { BottomNav } from "@/shared/ui/BottomNav";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Функции для действий профиля
  const handleProfileClick = () => {
    console.log("Переход в профиль пользователя...");
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    console.log("Выход из системы...");
    setIsMenuOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#F2F2F2] pb-32 relative font-sans selection:bg-[#573DEB]/20">
      
      {/* --- STICKY HEADER --- */}
      <header className="sticky top-0 z-[60] w-full bg-[#F2F2F2]">
        {/* CONTAINER (h: 104, pb: 8, gap: 4, bg: #F2F2F2) */}
        <div className="max-w-[400px] mx-auto w-full h-[60px] px-[16px] pb-[8px] flex justify-between items-end gap-[4px]">
          
          {/* LOGO BLOCK (left: 16, width: 116, height: 48, gap: 8) */}
          <div className="flex items-center gap-[8px] w-[116px] h-[48px]">
            <Logo className="w-[34px] h-[38px] text-black" />
            <span className="font-bold text-[18px] leading-[24px] tracking-[-0.04em] text-black uppercase">
              MOWAY
            </span>
          </div>
          
          {/* RIGHT CONTROLS (gap: 16) */}
          <div className="flex items-center gap-[16px] h-[48px]">
            
            {/* SEARCH BUTTON (48x48, p: 13, bg: white 50%, blur: 12px) */}
            <button className="w-[48px] h-[48px] p-[13px] flex items-center justify-center bg-white/50 backdrop-blur-[12px] rounded-full border border-white/50 active:scale-90 transition-all cursor-pointer">
              <Search size={22} className="text-[#1A1A1A]" />
            </button>
            
            {/* PROFILE WRAPPER (48x48) */}
            <div className="relative w-[48px] h-[48px]">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-full h-full rounded-full border border-white shadow-sm overflow-hidden active:scale-95 transition-transform cursor-pointer relative group"
              >
                <img 
                  src="/avatar.jpg" 
                  alt="User Profile" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                  onError={(e) => {
                    e.currentTarget.src = 'https://ui-avatars.com/api/?name=Nikita&background=573DEB&color=fff';
                  }}
                />
              </button>
              
              {/* RED DOT NOTIFICATION WRAPPER (12x12, left: 36) */}
<div className="absolute top-0 left-[36px] w-[12px] h-[12px] pointer-events-none z-10">
  {/* RENTAGLE (8x8, top: 2, left: 2, bg: #E5484D) */}
  <div className="absolute top-[2px] left-[2px] w-[10px] h-[10px] bg-[#E5484D] border-[1px] border-white rounded-full" />
</div>

              {/* DROPDOWN MENU */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    // Применили точные размеры (148x120), тень и закругления из макета
                    className="absolute top-[56px] right-0 w-[148px] h-[120px] bg-white rounded-[16px] shadow-[0_4px_20px_0_rgba(0,0,0,0.08)] flex flex-col z-50 overflow-hidden"
                  >
                    {/* Пункт 1: Профиль */}
                    <button 
                      type="button"
                      onClick={handleProfileClick}
                      className="flex items-center w-[148px] h-[40px] gap-[8px] px-[12px] py-[10px] border-b-[0.5px] border-[#E6E6E6] hover:bg-gray-50 transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                        <path d="M13.3547 11.1279C13.442 11.1798 13.5497 11.2406 13.6717 11.3094C14.2063 11.6111 15.0145 12.067 15.5681 12.6089C15.9143 12.9478 16.2433 13.3944 16.3031 13.9416C16.3667 14.5235 16.1129 15.0695 15.6036 15.5547C14.725 16.3917 13.6707 17.0625 12.307 17.0625H5.69328C4.32955 17.0625 3.27521 16.3917 2.39663 15.5547C1.88736 15.0695 1.63352 14.5235 1.69712 13.9416C1.75693 13.3944 2.08592 12.9478 2.43217 12.6089C2.9858 12.067 3.79393 11.6111 4.32854 11.3094C4.45053 11.2406 4.5583 11.1798 4.64553 11.1279C7.31107 9.54071 10.6892 9.54071 13.3547 11.1279Z" fill="black"/>
                        <path d="M5.06263 4.875C5.06263 2.70038 6.82551 0.9375 9.00013 0.9375C11.1748 0.9375 12.9376 2.70038 12.9376 4.875C12.9376 7.04962 11.1748 8.8125 9.00013 8.8125C6.82551 8.8125 5.06263 7.04962 5.06263 4.875Z" fill="black"/>
                      </svg>
                      <span className="w-[98px] h-[20px] text-[14px] font-normal leading-[20px] tracking-[-0.02em] text-black text-left">
                        Профиль
                      </span>
                    </button>

                    {/* Пункт 2: Уведомления */}
                    <button 
                      type="button"
                      onClick={() => { console.log("Открываем уведомления"); setIsMenuOpen(false); }}
                      className="flex items-center w-[148px] h-[40px] gap-[8px] px-[12px] py-[10px] border-b-[0.5px] border-[#E6E6E6] hover:bg-gray-50 transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                        <path d="M2.94589 6.95772C2.94592 3.63113 5.65814 0.9375 9 0.9375C12.3419 0.9375 15.0541 3.63116 15.0541 6.95777C15.0542 7.73159 15.1062 8.31553 15.463 8.84045C15.5126 8.91237 15.5784 9.00244 15.6503 9.10086L15.6503 9.10088C15.7752 9.27185 15.9185 9.468 16.0273 9.63788C16.2191 9.93772 16.4066 10.2993 16.471 10.7206C16.6812 12.0952 15.7121 12.9852 14.7469 13.384C11.3474 14.7887 6.65262 14.7887 3.25309 13.384C2.28792 12.9852 1.31877 12.0952 1.52901 10.7206C1.59345 10.2993 1.78089 9.93772 1.97275 9.63788C2.08146 9.46799 2.22477 9.27183 2.34968 9.10086C2.4216 9.00242 2.48742 8.91232 2.53703 8.84039C2.89378 8.3155 2.94582 7.73149 2.94589 6.95772Z" fill="black"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.80756 13.3378C6.20787 13.2315 6.61864 13.4697 6.72503 13.8701C6.97995 14.8293 7.89054 15.5627 9.00019 15.5627C10.1098 15.5627 11.0204 14.8293 11.2753 13.8701C11.3817 13.4697 11.7925 13.2315 12.1928 13.3378C12.5931 13.4442 12.8314 13.855 12.725 14.2553C12.2922 15.8839 10.7772 17.0627 9.00019 17.0627C7.22313 17.0627 5.70816 15.8839 5.27534 14.2553C5.16896 13.855 5.40724 13.4442 5.80756 13.3378Z" fill="black"/>
                      </svg>
                      <span className="w-[98px] h-[20px] text-[14px] font-normal leading-[20px] tracking-[-0.02em] text-black text-left">
                        Уведомления
                      </span>
                    </button>

                    {/* Пункт 3: Выход (без нижней обводки) */}
                    <button 
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center w-[148px] h-[40px] gap-[8px] px-[12px] py-[10px] hover:bg-gray-50 transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.95703 1.3125C7.31404 1.31249 6.02317 1.31278 5.01562 1.44824C3.98333 1.58708 3.16407 1.87695 2.52051 2.52051C1.87695 3.16407 1.58708 3.98333 1.44824 5.01562C1.31278 6.02317 1.31249 7.31404 1.3125 8.95703V9.04297C1.31249 10.686 1.31278 11.9768 1.44824 12.9844C1.58708 14.0167 1.87695 14.8359 2.52051 15.4795C3.16407 16.1231 3.98333 16.4129 5.01562 16.5518C6.02317 16.6872 7.31404 16.6875 8.95703 16.6875H9.04297C10.686 16.6875 11.9768 16.6872 12.9844 16.5518C14.0167 16.4129 14.8359 16.1231 15.4795 15.4795C16.1231 14.8359 16.4129 14.0167 16.5518 12.9844C16.6872 11.9768 16.6875 10.686 16.6875 9.04297V8.95703C16.6875 7.31404 16.6872 6.02317 16.5518 5.01562C16.4129 3.98333 16.1231 3.16407 15.4795 2.52051C14.8359 1.87695 14.0167 1.58708 12.9844 1.44824C11.9768 1.31278 10.686 1.31249 9.04297 1.3125H8.95703ZM12.75 5.4375C13.0607 5.4375 13.3125 5.68934 13.3125 6V12C13.3125 12.3107 13.0607 12.5625 12.75 12.5625C12.4393 12.5625 12.1875 12.3107 12.1875 12V6C12.1875 5.68934 12.4393 5.4375 12.75 5.4375ZM8.8291 7.00293C9.14303 6.84043 9.42796 7.02413 9.52441 7.08887C9.64782 7.17175 9.79244 7.29882 9.94043 7.42773L9.96191 7.44531C10.1885 7.64257 10.4399 7.87248 10.6377 8.09961C10.7365 8.21306 10.8346 8.33982 10.9102 8.47363C10.9811 8.59939 11.0625 8.78362 11.0625 9C11.0625 9.21638 10.9811 9.40061 10.9102 9.52637C10.8346 9.66018 10.7365 9.78694 10.6377 9.90039C10.4399 10.1275 10.1885 10.3574 9.96191 10.5547L9.94043 10.5723C9.79245 10.7012 9.64782 10.8283 9.52441 10.9111C9.42796 10.9759 9.14303 11.1596 8.8291 10.9971C8.51545 10.8347 8.469 10.4805 8.45508 10.3584C8.43732 10.2026 8.43746 10.0011 8.4375 9.7959V9.5625H5.25C4.93934 9.5625 4.6875 9.31066 4.6875 9C4.6875 8.68934 4.93934 8.4375 5.25 8.4375H8.4375V8.2041C8.43746 7.9989 8.43732 7.79741 8.45508 7.6416C8.469 7.51948 8.51545 7.1653 8.8291 7.00293Z" fill="black"/>
                      </svg>
                      <span className="w-[98px] h-[20px] text-[14px] font-normal leading-[20px] tracking-[-0.02em] text-black text-left">
                        Выход
                      </span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </div>
        </div>
      </header>

      {/* --- CONTENT AREA --- */}
      <div className="max-w-[400px] mx-auto px-[16px] pt-[4px] space-y-[32px]">
        <TurnoverWidget />
        <MyInstrumentsSection />
        <AddInstrumentSection />
      </div>

      {/* --- VIRTUAL PAGES & MODALS --- */}
      {/* OrdersPage внутри себя проверяет filter === 'DEPOSIT'.
          Мы рендерим его здесь, чтобы он мог перекрыть контент.
      */}
      <OrdersPage />

      {/* Нижнее меню. Убедись, что в его компоненте 
          прописан z-index выше чем у OrdersPage (например, z-[80]).
      */}
      <BottomNav />
      
      {/* Overlay для меню профиля */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-[55] bg-black/[0.02]" 
          onClick={() => setIsMenuOpen(false)} 
        />
      )}
    </main>
  );
}

// Вспомогательный компонент для пунктов меню
interface MenuLinkProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

const MenuLink = ({ icon, label, onClick, variant = 'default' }: MenuLinkProps) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-2.5 px-4 py-2.5 w-full transition-all active:bg-slate-50 cursor-pointer group",
      variant === 'danger' ? "text-[#FF4B4B]" : "text-[#1A1A1A]"
    )}
  >
    <span className="opacity-60 group-hover:opacity-100 transition-opacity">{icon}</span>
    <span className="text-[14px] font-medium tracking-[-0.02em] font-sans">
      {label}
    </span>
  </button>
);