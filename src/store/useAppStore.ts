import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AssetItem {
  id: string;
  name: string;
  value: number;
  sold: boolean;
}

interface AppState {
  balance: number;
  sadnessLevel: number; // XP para nível de tristeza
  luckyDays: number;
  hasCompletedOnboarding: boolean;
  assets: AssetItem[];
  
  // Ações
  completeOnboarding: () => void;
  sellAsset: (id: string) => void;
  addSadness: (amount: number) => void;
  incrementLuckyDays: () => void;
  resetProgress: () => void;
  updateBalance: (amount: number) => void;
}

const initialAssets: AssetItem[] = [
  { id: 'house', name: 'Uma Casa Inteira', value: 450000, sold: false },
  { id: 'car', name: 'Carro do Ano', value: 120000, sold: false },
  { id: 'savings', name: 'Poupança da Vida', value: 50000, sold: false },
  { id: 'tv', name: 'TV 65" OLED', value: 5000, sold: false },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      balance: 0.42, // "SALDO ATUAL DE DESESPERO: R$ 0,42"
      sadnessLevel: 0,
      luckyDays: 0,
      hasCompletedOnboarding: false,
      assets: initialAssets,

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      
      sellAsset: (id) => set((state) => {
        const assetIndex = state.assets.findIndex(a => a.id === id);
        if (assetIndex === -1 || state.assets[assetIndex].sold) return state;
        
        const newAssets = [...state.assets];
        newAssets[assetIndex] = { ...newAssets[assetIndex], sold: true };
        
        return {
          assets: newAssets,
          balance: state.balance + newAssets[assetIndex].value
        };
      }),
      
      addSadness: (amount) => set((state) => ({ sadnessLevel: state.sadnessLevel + amount })),
      
      incrementLuckyDays: () => set((state) => ({ luckyDays: state.luckyDays + 1 })),
      
      resetProgress: () => set({
        balance: 0.42,
        sadnessLevel: 0,
        luckyDays: 0,
        hasCompletedOnboarding: false,
        assets: initialAssets,
      }),
      
      updateBalance: (amount) => set((state) => ({ balance: Math.max(0, state.balance + amount) }))
    }),
    {
      name: 'biggerbet-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
