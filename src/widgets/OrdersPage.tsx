'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ChevronLeft, 
  Search, 
  ChevronDown, 
  Key, 
  Link2, 
  Smartphone, 
  LayoutGrid, 
  Check, 
  Settings2 
} from 'lucide-react';
import { cn } from "@/shared/lib/utils";
import { useInstrumentStore } from "@/shared/store/useInstrumentStore";
import { BottomNav } from "@/shared/ui/BottomNav";

import { OrderCard, type OrderStatus, type OrderPayload } from "@/entities/instrument/ui/OrderCard";
import { CreateOrderDrawer, type NewOrderPayload } from "./CreateOrderDrawer";
import { EmptyState } from "@/shared/ui/EmptyState";
import { DepositDrawer } from "./DepositDrawer";
import { ServicesPage } from "./ServicesPage";
import { useServicesStore } from '@/shared/store/useServicesStore';

const TABS = [
  { label: 'Все', value: 'ALL' },
  { label: 'Платежная ссылка', value: 'PAY-LINK', icon: Link2 },
  { label: 'API', value: 'API', icon: 'API_CUSTOM' },
  { label: 'QR-POS', value: 'QR-POS', icon: Smartphone },
  { label: 'QR-CODE', value: 'QR-CODE', icon: LayoutGrid },
  { label: 'Заказы с залогом', value: 'DEPOSIT', icon: Key },
];

const STATUS_OPTIONS = [
  { label: 'Все статусы', value: 'all' },
  { label: 'Создан и оплачен', value: 'paid' },
  { label: 'Не оплачен', value: 'unpaid' },
  { label: 'Оплачен частично', value: 'partial' },
  { label: 'Завершен', value: 'completed' },
];

const INITIAL_MOCK_ORDERS: OrderPayload[] = [
  { id: '12758', date: '28.12.2025 14:47:13', customer: 'Константинов Константин', item: 'Шуруповерт BOSCH инв № 112233', phone: '+7 999 999 99 99', returnDate: 'Дата возврата 29.12.2025 (через 1 дн.)', price: '2 500 ₽', deposit: '300', status: 'paid' },
];

export const OrdersPage = () => {
  // --- ГЛОБАЛЬНЫЙ СТЕЙТ ---
  const filter = useInstrumentStore((state) => state.filter);
  const setFilter = useInstrumentStore((state) => state.setFilter);
  const totalServices = useServicesStore(state => state.services.length);

  // --- ЛОКАЛЬНЫЙ СТЕЙТ ---
  // Теперь isOpen напрямую зависит от глобального фильтра.
  // Если из BottomNav прилетит reset в 'ALL', страница схлопнется сама.
  const isOpen = (filter as string) === 'DEPOSIT';

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isServicesPageOpen, setIsServicesPageOpen] = useState(false);
  const [selectedOrderForDeposit, setSelectedOrderForDeposit] = useState<NewOrderPayload | null>(null);
  const [orders, setOrders] = useState<NewOrderPayload[]>(INITIAL_MOCK_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- ЭФФЕКТЫ ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
    };
    if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // --- ХЕНДЛЕРЫ ---
  const handleTabClick = (tabValue: string) => {
    setFilter(tabValue as any);
  };

  const handleAddOrder = (newOrder: NewOrderPayload) => {
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  const handleBack = () => {
    setFilter('ALL' as any);
  };

  // --- ЛОГИКА ФИЛЬТРАЦИИ ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        order.id.includes(query) || 
        order.customer.toLowerCase().includes(query) || 
        order.item.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const activeFilterLabel = STATUS_OPTIONS.find(opt => opt.value === statusFilter)?.label || 'Фильтр';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          className="fixed inset-0 z-[120] bg-[#F4F5F7] flex flex-col overflow-hidden font-sans"
        >
          {/* HEADER */}
          <header className="px-4 pt-12 pb-4 shrink-0 bg-[#F4F5F7] z-20 flex items-center justify-center relative">
            <button 
              onClick={handleBack} 
              className="absolute left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm z-10 active:scale-95 transition-transform"
            >
              <ChevronLeft size={24} className="text-[#1A1A1A]" />
            </button>
            <h1 className="text-[20px] font-bold text-[#1A1A1A] tracking-tight">Заказы</h1>
          </header>

          <main className="flex-1 overflow-y-auto no-scrollbar px-4 pb-[160px]">
            {/* TABS КАТЕГОРИЙ */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 -mx-4 px-4 pb-1">
              {TABS.map((tab) => {
                const isActive = (filter as string) === tab.value;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleTabClick(tab.value)}
                    className={cn(
                      "shrink-0 px-4 py-2.5 rounded-[16px] text-[14px] font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95",
                      isActive ? "bg-[#573DEB] text-white" : "bg-white text-[#1A1A1A]"
                    )}
                  >
                    {Icon === 'API_CUSTOM' ? (
                      <div className={cn("w-[18px] h-[18px] rounded-[4px] flex items-center justify-center", isActive ? "bg-white" : "bg-[#1A1A1A]")}>
                        <span className={cn("text-[9px] font-black leading-none tracking-tighter", isActive ? "text-[#573DEB]" : "text-white")}>{"</>"}</span>
                      </div>
                    ) : Icon ? <Icon size={18} className={isActive ? "text-white" : "text-[#1A1A1A]"} /> : null}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* КНОПКА УПРАВЛЕНИЯ АССОРТИМЕНТОМ */}
            <button
              onClick={() => setIsServicesPageOpen(true)}
              className="w-full bg-white rounded-[16px] py-4 px-4 flex items-center justify-between mb-4 shadow-sm active:scale-[0.98] transition-all hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Settings2 size={18} className="text-[#573DEB]" />
                <span className="text-[15px] font-bold text-[#1A1A1A]">Управление ассортиментом</span>
              </div>
              <span className="bg-[#EEEDFC] text-[#573DEB] text-[13px] font-black px-2.5 py-0.5 rounded-full">
                {totalServices}
              </span>
            </button>

            {/* ПОИСК */}
            <div className="relative mb-4 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999] group-focus-within:text-[#573DEB] transition-colors" size={20} />
              <input
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Искать заказ"
                className="w-full h-[52px] bg-white rounded-[16px] pl-12 pr-4 text-[16px] outline-none shadow-sm focus:border focus:border-[#573DEB]/40 transition-all placeholder:text-[#999999]"
              />
            </div>

            {/* ФИЛЬТР ПО СТАТУСАМ */}
            <div className="relative mb-6 z-30" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-white px-4 py-2 rounded-[14px] text-[14px] font-medium text-[#1A1A1A] flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                {activeFilterLabel}
                <ChevronDown size={18} className={cn("transition-transform duration-200", isDropdownOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-[110%] left-0 w-[220px] bg-white rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[#F0F0F0] py-1.5 overflow-hidden"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setStatusFilter(option.value); setIsDropdownOpen(false); }}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-black/5 transition-colors text-left"
                      >
                        <span className={cn("text-[14px]", statusFilter === option.value ? "font-semibold text-[#573DEB]" : "font-medium text-[#1A1A1A]")}>
                          {option.label}
                        </span>
                        {statusFilter === option.value && <Check size={16} className="text-[#573DEB]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* СПИСОК ЗАКАЗОВ / EMPTY STATE */}
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onComplete={(order) => setSelectedOrderForDeposit(order)} 
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                text={
                  totalServices === 0
                    ? "Здесь пока ничего нет,\nсначала добавьте услугу в ассортимент"
                    : orders.length === 0
                      ? "У вас пока нет заказов,\nсоздайте первый"
                      : "Ничего не найдено\nпо выбранным фильтрам"
                }
                btnText={
                  totalServices === 0
                    ? "Управление ассортиментом"
                    : orders.length === 0
                      ? "Создать заказ"
                      : undefined
                }
                onAdd={
                  totalServices === 0
                    ? () => setIsServicesPageOpen(true)
                    : orders.length === 0
                      ? () => setIsCreateOpen(true)
                      : undefined
                }
              />
            )}
          </main>

          {/* FAB КНОПКА */}
          {totalServices > 0 && (
            <motion.button
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsCreateOpen(true)}
              className="fixed bottom-[100px] left-1/2 -translate-x-1/2 z-[85] flex items-center justify-center gap-[6px] px-[16px] h-[48px] bg-[#573DEB] text-white rounded-full font-bold shadow-[0_8px_24px_rgba(87,61,235,0.35)] whitespace-nowrap"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span className="text-[15px]">Создать заказ</span>
            </motion.button>
          )}

          {/* BOTTOM NAV */}
          <div className="relative z-[90]"><BottomNav /></div>

          {/* DRAWERS */}
          <AnimatePresence>
            {isCreateOpen && (
              <CreateOrderDrawer 
                onClose={() => setIsCreateOpen(false)} 
                onAdd={handleAddOrder} 
              />
            )}
          </AnimatePresence>

          <DepositDrawer 
            isOpen={!!selectedOrderForDeposit} 
            onClose={() => setSelectedOrderForDeposit(null)} 
            order={selectedOrderForDeposit} 
          />

          <AnimatePresence>
            {isServicesPageOpen && (
              <ServicesPage onClose={() => setIsServicesPageOpen(false)} />
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
};