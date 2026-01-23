"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Settings } from "@/types";

const defaultSettings: Settings = {
  backgroundGrid: {
    type: "default",
    gridSize: 60,
    lineWidth: 0.5,
    baseOpacity: 0.12,
    highlightIntensity: 0.35,
    highlightSize: 1.75,
  },
  globe: {
    rotationSpeed: 0.1,
    lineWidth: 0.035,
    meridians: 12,
    parallels: 8,
    acidity: 0.0125,
  },
  interaction: {
    mouseSensitivity: 0.2,
    gyroscopeSensitivity: 1.0,
  },
  audio: {
    flashbangOnLightMode: true,
  },
  performance: {
    lowPerformanceMode: "auto",
    showFpsCounter: false,
  },
  navigation: {
    showBreadcrumbs: true,
  },
};

interface SettingsStore {
  settings: Settings;
  setSettings: (settings: Partial<Settings>) => void;
  updateBackgroundGrid: (updates: Partial<Settings["backgroundGrid"]>) => void;
  updateGlobe: (updates: Partial<Settings["globe"]>) => void;
  updateInteraction: (updates: Partial<Settings["interaction"]>) => void;
  updateAudio: (updates: Partial<Settings["audio"]>) => void;
  updatePerformance: (updates: Partial<Settings["performance"]>) => void;
  updateNavigation: (updates: Partial<Settings["navigation"]>) => void;
  resetToDefaults: () => void;
}

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      updateBackgroundGrid: (updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            backgroundGrid: { ...state.settings.backgroundGrid, ...updates },
          },
        })),
      updateGlobe: (updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            globe: { ...state.settings.globe, ...updates },
          },
        })),
      updateInteraction: (updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            interaction: { ...state.settings.interaction, ...updates },
          },
        })),
      updateAudio: (updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            audio: { ...state.settings.audio, ...updates },
          },
        })),
      updatePerformance: (updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            performance: { ...state.settings.performance, ...updates },
          },
        })),
      updateNavigation: (updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            navigation: { ...state.settings.navigation, ...updates },
          },
        })),
      resetToDefaults: () => set({ settings: defaultSettings }),
    }),
    {
      name: "rvfet-settings",
    }
  )
);
