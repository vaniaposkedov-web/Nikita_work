import { create } from 'zustand';
import { IInstrument, InstrumentType } from '@/entities/instrument/model/types';

interface InstrumentState {
  instruments: IInstrument[];
  filter: InstrumentType | 'ALL';
  setFilter: (filter: InstrumentType | 'ALL') => void;
  removeInstrument: (id: string) => void;
}

export const useInstrumentStore = create<InstrumentState>((set) => ({
  instruments: [
    { id: '1', externalId: '12758', type: 'QR-POS', title: 'Точка на рынке', date: '3.08.2025', status: 'active' },
    { id: '2', externalId: '12758', type: 'QR-CODE', title: 'Витрина магазина', date: '3.08.2025', status: 'active' },
    { id: '3', externalId: '12758', type: 'PAY-LINK', title: 'Онлайн услуги', date: '3.08.2025', status: 'active' },
  ],
  filter: 'ALL',
  setFilter: (filter) => set({ filter }),
  removeInstrument: (id) => 
    set((state) => ({
      instruments: state.instruments.filter((item) => item.id !== id)
    })),
}));