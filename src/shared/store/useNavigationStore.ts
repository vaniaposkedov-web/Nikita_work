import { create } from 'zustand';

interface NavigationState {
  activeTab: string;
  isNavVisible: boolean; // Флаг видимости
  setActiveTab: (tabId: string) => void;
  setNavVisibility: (visible: boolean) => void; // Метод переключения
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeTab: 'home',
  isNavVisible: true, // По умолчанию видно
  setActiveTab: (tabId) => set({ activeTab: tabId }),
  setNavVisibility: (visible) => set({ isNavVisible: visible }),
}));