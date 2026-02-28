'use client';

import React, { useState } from 'react';
import { Search, User, Bell, LogOut, Settings } from 'lucide-react';
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
                    className="absolute top-[58px] right-0 w-[148px] bg-white rounded-[16px] shadow-[0_10px_25px_rgba(0,0,0,0.1)] py-1.5 overflow-hidden border border-black/5 z-50"
                  >
                    <div className="flex flex-col">
                      <MenuLink 
                        icon={<User size={16} />} 
                        label="Профиль" 
                        onClick={handleProfileClick}
                      />
                      <MenuLink 
                        icon={<Bell size={16} />} 
                        label="Уведомления" 
                        onClick={() => console.log("Открываем уведомления")}
                      />
                      <MenuLink 
                        icon={<Settings size={16} />} 
                        label="Настройки" 
                        onClick={() => console.log("Открываем настройки")}
                      />
                      <div className="h-[1px] bg-black/[0.06] my-1 mx-3" />
                      <MenuLink 
                        icon={<LogOut size={16} />} 
                        label="Выход" 
                        variant="danger" 
                        onClick={handleLogout}
                      />
                    </div>
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