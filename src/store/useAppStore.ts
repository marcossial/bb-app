import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AssetItem {
  id: string;
  name: string;
  value: number;
  sold: boolean;
}

// Define quanto de XP é necessário para subir 1 Nível de Tristeza
export const XP_PER_LEVEL = 1000;

interface AppState {
  balance: number;
  sadnessLevel: number;
  xp: number;
  username: string | null;
  luckyDays: number;
  hasCompletedOnboarding: boolean;
  assets: AssetItem[];

  // Ações
  completeOnboarding: () => void;
  sellAsset: (id: string) => void;
  addXp: (amount: number) => void;
  generateInitialName: () => void;
  incrementLuckyDays: () => void;
  resetProgress: () => void;
  updateBalance: (amount: number) => void;
}

const initialAssets: AssetItem[] = [
  { id: "house", name: "Uma Casa Inteira", value: 450000, sold: false },
  { id: "car", name: "Carro do Ano", value: 120000, sold: false },
  { id: "savings", name: "Poupança da Vida", value: 50000, sold: false },
  { id: "tv", name: 'TV 65" OLED', value: 5000, sold: false },
];

const NAMES = [
  "Rei do Loss",
  "Sardinha Emocionada",
  "Faria Limer Falido",
  "Mago do Urubu do Pix",
  "Mão de Alface",
  "Patrocinador de Corretora",
  "Devendo o Agiota",
  "Primo Pobre",
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      balance: 0.42,
      sadnessLevel: 1,
      xp: 0,
      username: null,
      luckyDays: 0,
      hasCompletedOnboarding: false,
      assets: initialAssets,

      completeOnboarding: () => set({ hasCompletedOnboarding: true }),

      generateInitialName: () =>
        set((state) => {
          if (!state.username) {
            const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
            return { username: randomName };
          }
          return state;
        }),

      sellAsset: (id) =>
        set((state) => {
          const assetIndex = state.assets.findIndex((a) => a.id === id);
          if (assetIndex === -1 || state.assets[assetIndex].sold) return state;

          const newAssets = [...state.assets];
          newAssets[assetIndex] = { ...newAssets[assetIndex], sold: true };

          const newXp = state.xp + 500;

          return {
            assets: newAssets,
            balance: state.balance + newAssets[assetIndex].value,
            xp: newXp,
            sadnessLevel: Math.floor(newXp / XP_PER_LEVEL) + 1,
          };
        }),

      addXp: (amount) =>
        set((state) => {
          const newXp = state.xp + amount;
          return {
            xp: newXp,
            sadnessLevel: Math.floor(newXp / XP_PER_LEVEL) + 1,
          };
        }),

      incrementLuckyDays: () =>
        set((state) => ({
          luckyDays: state.luckyDays + 1,
        })),

      resetProgress: () =>
        set({
          balance: 0.42,
          sadnessLevel: 1,
          xp: 0,
          username: null,
          luckyDays: 0,
          hasCompletedOnboarding: false,
          assets: initialAssets,
        }),

      updateBalance: (amount) =>
        set((state) => ({
          balance: Math.max(0, state.balance + amount),
        })),
    }),
    {
      name: "biggerbet-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
