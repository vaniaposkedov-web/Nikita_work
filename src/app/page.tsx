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
      {/* z-[60] — твой текущий слой для шапки */}
      <header className="sticky top-0 z-[60] w-full bg-[#F2F2F2]/80 backdrop-blur-lg border-b border-black/[0.02]">
        <div className="max-w-[400px] mx-auto px-5 py-3 flex justify-between items-center h-[72px]">
          <div className="flex items-center gap-2">
            <Logo className="w-[34px] h-[38px] text-black" />
            <span className="font-bold text-[18px] leading-[24px] tracking-[-0.04em] text-black uppercase">
              MOWAY
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="w-[48px] h-[48px] flex items-center justify-center bg-white/50 backdrop-blur-[12px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-90 transition-all cursor-pointer border border-white/50">
              <Search size={22} className="text-[#1A1A1A]" />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-[48px] h-[48px] rounded-full border border-white shadow-sm overflow-hidden active:scale-95 transition-transform cursor-pointer relative group"
              >
                <img 
                  src="/avatar.jpg" 
                  alt="User Profile" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                  onError={(e) => {
                    e.currentTarget.src = 'https://ui-avatars.com/api/?name=Nikita&background=573DEB&color=fff';
                  }}
                />
                <div className="absolute top-[2px] right-[2px] w-[11px] h-[11px] bg-[#FF4B4B] border-[2px] border-white rounded-full shadow-sm" />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute top-[58px] right-0 w-[148px] bg-white rounded-[16px] shadow-[0_10px_25px_rgba(0,0,0,0.1)] py-1.5 overflow-hidden border border-black/5"
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
      <div className="max-w-[400px] mx-auto px-5 pt-6 space-y-10">
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