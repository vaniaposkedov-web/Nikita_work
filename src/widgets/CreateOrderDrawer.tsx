'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Check } from 'lucide-react';
import { cn } from "@/shared/lib/utils";
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { useServicesStore } from '@/shared/store/useServicesStore';

export interface NewOrderPayload {
  id: string;
  date: string;
  customer: string;
  item: string;
  phone: string;
  returnDate: string;
  price: string;
  deposit: string;
  status: 'paid' | 'unpaid' | 'partial' | 'completed';
}

interface CreateOrderDrawerProps {
  isOpen?: boolean; 
  onClose: () => void;
  onAdd: (order: NewOrderPayload) => void;
}

export const CreateOrderDrawer = ({ onClose, onAdd }: CreateOrderDrawerProps) => {
  const services = useServicesStore(state => state.services);

  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [returnDate, setReturnDate] = useState('');
  
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (drawerRef.current) disableBodyScroll(drawerRef.current);
    return () => clearAllBodyScrollLocks();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServiceDropdownOpen(false);
      }
    };
    if (isServiceDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isServiceDropdownOpen]);

  const selectedService = services.find(s => s.id === selectedServiceId);

  const handleSubmit = () => {
    if (!selectedService || !customer.trim() || !phone.trim() || !returnDate) return;

    const formattedPrice = `${parseInt(selectedService.price).toLocaleString('ru-RU')} ₽`;

    const newOrder: NewOrderPayload = {
      id: Math.floor(10000 + Math.random() * 90000).toString(),
      date: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
      customer,
      item: selectedService.title,
      phone,
      returnDate: `Дата возврата ${returnDate.split('-').reverse().join('.')} (через ... дн.)`,
      price: formattedPrice,
      deposit: selectedService.deposit,
      status: 'unpaid',
    };

    onAdd(newOrder);
    onClose();
  };

  return (
    <>
      {/* ПОВЕРХ BOTTOM NAV: z-[200] */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-[2px]"
      />

      {/* ПОВЕРХ BOTTOM NAV: z-[201] */}
      <motion.div
        ref={drawerRef}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-white z-[201] rounded-t-[32px] p-5 pb-12 shadow-[0_-8px_32px_rgba(0,0,0,0.15)] font-sans overflow-y-auto max-h-[92vh] no-scrollbar"
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />

        <div className="flex justify-between items-center mb-6 px-1">
          <h2 className="text-[22px] font-black text-[#1A1A1A] tracking-tight">Новый заказ</h2>
          <button onClick={onClose} className="w-10 h-10 bg-[#F4F5F7] flex items-center justify-center rounded-full active:scale-90 transition-all">
            <X size={22} className="text-[#1A1A1A]" />
          </button>
        </div>

        <div className="space-y-5 mb-10">
          <div className="relative" ref={dropdownRef}>
            <label className="text-[11px] font-bold text-[#999999] uppercase tracking-wider ml-4 mb-1.5 block">ИНСТРУМЕНТ (УСЛУГА)</label>
            <button
              onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
              className="w-full h-[56px] border-2 border-[#F4F5F7] rounded-[18px] px-4 text-[16px] font-bold flex items-center justify-between outline-none bg-white focus:border-[#573DEB]/30 transition-all text-left"
            >
              <span className={cn("truncate", !selectedService && "text-[#999999] font-medium")}>
                {selectedService ? selectedService.title : 'Выберите из ассортимента'}
              </span>
              <ChevronDown size={20} className={cn("text-[#999999] transition-transform duration-200", isServiceDropdownOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isServiceDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-[100%] left-0 right-0 mt-2 bg-white rounded-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-[#F0F0F0] py-2 z-50 max-h-[240px] overflow-y-auto no-scrollbar"
                >
                  {services.length === 0 ? (
                    <div className="px-4 py-4 text-[14px] text-[#999999] text-center font-medium">Ассортимент пуст. Добавьте услуги.</div>
                  ) : (
                    services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => { setSelectedServiceId(service.id); setIsServiceDropdownOpen(false); }}
                        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-black/5 transition-colors text-left"
                      >
                        <span className={cn("text-[15px]", selectedServiceId === service.id ? "font-bold text-[#573DEB]" : "font-medium text-[#1A1A1A]")}>
                          {service.title}
                        </span>
                        {selectedServiceId === service.id && <Check size={18} className="text-[#573DEB]" strokeWidth={3} />}
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <label className="text-[11px] font-bold text-[#999999] uppercase tracking-wider ml-4 mb-1.5 block">
                ЦЕНА {selectedService ? `В ${selectedService.period.toUpperCase()}` : 'В ЧАС'}
              </label>
              <div className="relative">
                <input
                  type="text" value={selectedService ? selectedService.price : ''} readOnly placeholder="0"
                  className="w-full h-[56px] bg-[#F4F5F7] rounded-[18px] pl-4 pr-8 text-[16px] text-[#1A1A1A] font-bold outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] font-bold">₽</span>
              </div>
            </div>
            <div className="flex-1 relative">
              <label className="text-[11px] font-bold text-[#999999] uppercase tracking-wider ml-4 mb-1.5 block">ЗАЛОГ</label>
              <div className="relative">
                <input
                  type="text" value={selectedService ? selectedService.deposit : ''} readOnly placeholder="0"
                  className="w-full h-[56px] bg-[#F4F5F7] rounded-[18px] pl-4 pr-8 text-[16px] text-[#1A1A1A] font-bold outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] font-bold">₽</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#999999] uppercase tracking-wider ml-4 mb-1.5 block">КЛИЕНТ</label>
            <input
              type="text" value={customer} onChange={(e) => setCustomer(e.target.value)}
              placeholder="ФИО клиента"
              className="w-full h-[56px] border-2 border-[#F4F5F7] rounded-[18px] px-5 text-[16px] font-bold text-[#1A1A1A] outline-none focus:border-[#573DEB]/30 transition-all placeholder:font-medium"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[11px] font-bold text-[#999999] uppercase tracking-wider ml-4 mb-1.5 block">ТЕЛЕФОН</label>
              <input
                type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="+7"
                className="w-full h-[56px] bg-[#E7F0FE]/50 border-2 border-transparent rounded-[18px] px-5 text-[16px] font-bold text-[#1A1A1A] outline-none focus:border-[#573DEB]/30 transition-all"
              />
            </div>
            <div className="flex-1 relative">
              <label className="text-[11px] font-bold text-[#999999] uppercase tracking-wider ml-4 mb-1.5 block">СРОК ДО</label>
              <input
                type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)}
                className="w-full h-[56px] border-2 border-[#F4F5F7] rounded-[18px] px-4 text-[16px] font-bold text-[#1A1A1A] outline-none focus:border-[#573DEB]/30 transition-all"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full h-[58px] bg-[#573DEB] text-white font-black text-[16px] rounded-[20px] shadow-[0_10px_28px_rgba(87,61,235,0.3)] active:scale-[0.97] transition-all"
        >
          Создать запись
        </button>
      </motion.div>
    </>
  );
};