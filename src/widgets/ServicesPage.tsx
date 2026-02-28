'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronLeft, Search, ChevronDown, Check } from 'lucide-react';
import { cn } from "@/shared/lib/utils";
import { EmptyState } from "@/shared/ui/EmptyState"; 
import { ServiceCard } from "@/entities/instrument/ui/ServiceCard";
import { AddServiceDrawer } from "./AddServiceDrawer";
import { useServicesStore } from '@/shared/store/useServicesStore';

const FILTER_OPTIONS = [
  { label: 'Активные услуги', value: 'active' },
  { label: 'Архив', value: 'archived' },
];

interface ServicesPageProps {
  onClose: () => void;
}

export const ServicesPage = ({ onClose }: ServicesPageProps) => {
  const services = useServicesStore(state => state.services);
  const deleteService = useServicesStore(state => state.deleteService);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
    };
    if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Оптимизированная фильтрация
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesStatus = statusFilter === 'active' ? service.isActive : !service.isActive;
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || service.id.includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  }, [services, searchQuery, statusFilter]);

  const activeFilterLabel = FILTER_OPTIONS.find(opt => opt.value === statusFilter)?.label || 'Фильтр';

  return (
    <motion.div 
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      className="fixed inset-0 z-[100] bg-[#F4F5F7] flex flex-col overflow-hidden font-sans"
    >
      <header className="px-4 pt-12 pb-4 shrink-0 bg-[#F4F5F7] z-20 flex items-center justify-center relative">
        <button 
          onClick={onClose}
          className="absolute left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm z-10 active:scale-95 transition-transform"
        >
          <ChevronLeft size={24} className="text-[#1A1A1A]" />
        </button>
        <h1 className="text-[20px] font-bold text-[#1A1A1A] tracking-tight">Услуги</h1>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-4 pb-[100px]">
        <button 
          onClick={() => setIsAddDrawerOpen(true)}
          className="w-full h-[52px] bg-[#573DEB] text-white rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2 mb-6 shadow-[0_8px_24px_rgba(87,61,235,0.25)] active:scale-[0.98] transition-all"
        >
          <Plus size={20} strokeWidth={3} />
          Добавить услугу
        </button>

        <div className="relative mb-4 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999] group-focus-within:text-[#573DEB] transition-colors" size={20} />
          <input 
            type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Искать услугу" 
            className="w-full h-[52px] bg-white rounded-[16px] pl-12 pr-4 text-[16px] outline-none shadow-sm focus:ring-2 focus:ring-[#573DEB]/10 transition-all placeholder:text-[#999999]" 
          />
        </div>

        <div className="relative mb-6 z-30" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white px-4 py-2.5 rounded-[14px] text-[14px] font-semibold text-[#1A1A1A] flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            {activeFilterLabel}
            <ChevronDown size={18} className={cn("transition-transform duration-200", isDropdownOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-[110%] left-0 w-[220px] bg-white rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[#F0F0F0] py-1.5 overflow-hidden"
              >
                {FILTER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => { setStatusFilter(option.value); setIsDropdownOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-black/5 transition-colors text-left"
                  >
                    <span className={cn("text-[14px]", statusFilter === option.value ? "font-bold text-[#573DEB]" : "font-medium text-[#1A1A1A]")}>
                      {option.label}
                    </span>
                    {statusFilter === option.value && <Check size={16} className="text-[#573DEB]" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {filteredServices.length > 0 ? (
          <div className="space-y-4">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} onDelete={deleteService} />
            ))}
          </div>
        ) : (
          <EmptyState 
            text={services.length === 0 ? "Ассортимент пуст,\nдобавьте первую услугу" : "По вашему запросу\nничего не найдено"} 
            // Кнопка сброса удалена, используем одну универсальную если нужно
            btnText={services.length === 0 ? "Добавить услугу" : "Очистить поиск"} 
            onAdd={() => services.length === 0 ? setIsAddDrawerOpen(true) : setSearchQuery('')} 
          />
        )}
      </main>

      <AddServiceDrawer isOpen={isAddDrawerOpen} onClose={() => setIsAddDrawerOpen(false)} />
    </motion.div>
  );
};