import { create } from 'zustand';
import { ServicePayload } from '@/entities/instrument/ui/ServiceCard';

interface ServicesState {
  services: ServicePayload[];
  addService: (service: ServicePayload) => void;
  deleteService: (id: string) => void;
}

export const useServicesStore = create<ServicesState>((set) => ({
  services: [
    { id: '12758', date: '28.12.2025 14:47:13', title: 'Шуруповерт BOSCH инв № 112233', price: '2500', deposit: '300', period: 'день', isActive: true },
    { id: '12759', date: '28.12.2025 15:20:00', title: 'Перфоратор Makita X2', price: '3000', deposit: '500', period: 'час', isActive: true },
  ],
  addService: (service) => set((state) => ({ services: [service, ...state.services] })),
  deleteService: (id) => set((state) => ({ services: state.services.filter(s => s.id !== id) })),
}));