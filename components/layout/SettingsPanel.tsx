"use client";

import { useState, useRef, useEffect } from "react";
import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";
import { Settings, X, ChevronDown, RotateCcw } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface SliderSettingProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
}

function SliderSetting({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = "",
}: SliderSettingProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-foreground">{label}</label>
        <span className="text-xs text-muted-foreground tabular-nums">
          {value.toFixed(step < 1 ? 2 : 0)}{unit}
        </span>
      </div>
      <Slider.Root
        className="relative flex h-5 w-full touch-none select-none items-center"
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
      >
        <Slider.Track className="relative h-1 flex-1 rounded-full bg-muted">
          <Slider.Range className="absolute h-full rounded-full bg-foreground" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-4 w-4 rounded-full border border-border bg-background shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-foreground/20"
          aria-label={label}
        />
      </Slider.Root>
    </div>
  );
}

interface SwitchSettingProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function SwitchSetting({
  label,
  description,
  checked,
  onChange,
}: SwitchSettingProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-0.5">
        <label className="text-sm text-foreground">{label}</label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        className={cn(
          "relative h-5 w-9 shrink-0 cursor-pointer rounded-full border border-border transition-colors",
          checked ? "bg-foreground" : "bg-muted"
        )}
      >
        <Switch.Thumb
          className={cn(
            "block h-4 w-4 rounded-full bg-background shadow-sm transition-transform",
            checked ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </Switch.Root>
    </div>
  );
}

interface SelectSettingProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function SelectSetting({ label, value, options, onChange }: SelectSettingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="space-y-2">
      <label className="text-sm text-foreground">{label}</label>
      <div ref={selectRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-foreground/20"
          )}
        >
          <span>{selectedOption?.label || value}</span>
          <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-md border border-border bg-card shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center px-3 py-2 text-sm text-left hover:bg-muted",
                  value === option.value && "bg-muted"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const {
    settings,
    updateBackgroundGrid,
    updateGlobe,
    updateInteraction,
    updateAudio,
    updatePerformance,
    updateNavigation,
    resetToDefaults,
  } = useSettings();

  const toggleOpen = () => {
    setOpen(!open);
  };

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Don't close if clicking the button itself
      if (buttonRef.current?.contains(event.target as Node)) {
        return;
      }
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      // Use setTimeout to avoid immediate closure
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [open]);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleOpen}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          "border border-white/10 bg-white/5 text-zinc-400 transition-all hover:bg-white/10 hover:text-white",
          open && "bg-white/10 text-white"
        )}
        aria-label="Website settings"
        aria-expanded={open}
      >
        <Settings className="h-4 w-4" />
      </button>

      <div
        ref={panelRef}
        className={cn(
          "absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-border bg-card shadow-xl transition-all duration-200",
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        )}
        style={{ display: open ? 'block' : 'none' }}
      >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Website Settings</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={resetToDefaults}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Reset to defaults"
                title="Reset to defaults"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close settings"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Settings Content */}
          <div className="max-h-[70vh] overflow-y-auto p-4 space-y-6 custom-scrollbar">
            {/* Background Grid Settings */}
            <SettingsSection title="Background Grid">
              <SelectSetting
                label="Grid Type"
                value={settings.backgroundGrid.type}
                options={[
                  { value: "default", label: "Default" },
                  { value: "minimal", label: "Minimal" },
                  { value: "dense", label: "Dense" },
                  { value: "off", label: "Off" },
                ]}
                onChange={(value) =>
                  updateBackgroundGrid({ type: value as "default" | "minimal" | "dense" | "off" })
                }
              />

              <SliderSetting
                label="Grid Size"
                value={settings.backgroundGrid.gridSize}
                min={20}
                max={120}
                step={5}
                onChange={(value) => updateBackgroundGrid({ gridSize: value })}
                unit="px"
              />

              <SliderSetting
                label="Line Width"
                value={settings.backgroundGrid.lineWidth}
                min={0.1}
                max={2}
                step={0.1}
                onChange={(value) => updateBackgroundGrid({ lineWidth: value })}
                unit="px"
              />

              <SliderSetting
                label="Base Opacity"
                value={settings.backgroundGrid.baseOpacity}
                min={0}
                max={0.5}
                step={0.01}
                onChange={(value) => updateBackgroundGrid({ baseOpacity: value })}
              />

              <SliderSetting
                label="Highlight Intensity"
                value={settings.backgroundGrid.highlightIntensity}
                min={0}
                max={1}
                step={0.05}
                onChange={(value) => updateBackgroundGrid({ highlightIntensity: value })}
              />

              <SliderSetting
                label="Highlight Size"
                value={settings.backgroundGrid.highlightSize}
                min={0.5}
                max={3}
                step={0.25}
                onChange={(value) => updateBackgroundGrid({ highlightSize: value })}
              />
            </SettingsSection>

            {/* Globe Settings */}
            <SettingsSection title="Globe">
              <SliderSetting
                label="Rotation Speed"
                value={settings.globe.rotationSpeed}
                min={0}
                max={0.5}
                step={0.01}
                onChange={(value) => updateGlobe({ rotationSpeed: value })}
              />

              <SliderSetting
                label="Line Width"
                value={settings.globe.lineWidth}
                min={0.01}
                max={0.1}
                step={0.005}
                onChange={(value) => updateGlobe({ lineWidth: value })}
              />

              <SliderSetting
                label="Meridians"
                value={settings.globe.meridians}
                min={4}
                max={24}
                step={2}
                onChange={(value) => updateGlobe({ meridians: value })}
              />

              <SliderSetting
                label="Parallels"
                value={settings.globe.parallels}
                min={2}
                max={16}
                step={1}
                onChange={(value) => updateGlobe({ parallels: value })}
              />

              <SliderSetting
                label="Acidity"
                value={settings.globe.acidity}
                min={0}
                max={0.05}
                step={0.0025}
                onChange={(value) => updateGlobe({ acidity: value })}
              />
            </SettingsSection>

            {/* Interaction Settings */}
            <SettingsSection title="Interaction">
              <SliderSetting
                label="Mouse Sensitivity"
                value={settings.interaction.mouseSensitivity}
                min={0}
                max={1}
                step={0.05}
                onChange={(value) => updateInteraction({ mouseSensitivity: value })}
              />

              <SliderSetting
                label="Gyroscope Sensitivity"
                value={settings.interaction.gyroscopeSensitivity}
                min={0}
                max={2}
                step={0.1}
                onChange={(value) => updateInteraction({ gyroscopeSensitivity: value })}
              />
            </SettingsSection>

            {/* Audio Settings */}
            <SettingsSection title="Audio">
              <SwitchSetting
                label="Flashbang on Light Mode"
                description="Play sound effect when switching to light mode"
                checked={settings.audio.flashbangOnLightMode}
                onChange={(checked) => updateAudio({ flashbangOnLightMode: checked })}
              />
            </SettingsSection>

            {/* Performance Settings */}
            <SettingsSection title="Performance">
              <SelectSetting
                label="Performance Mode"
                value={settings.performance.lowPerformanceMode}
                options={[
                  { value: "auto", label: "Auto Detect" },
                  { value: "low", label: "Low Performance" },
                  { value: "high", label: "High Performance" },
                ]}
                onChange={(value) =>
                  updatePerformance({
                    lowPerformanceMode: value as "auto" | "low" | "high",
                  })
                }
              />

              <SwitchSetting
                label="Show FPS Counter"
                description="Display frames per second in the corner"
                checked={settings.performance.showFpsCounter}
                onChange={(checked) => updatePerformance({ showFpsCounter: checked })}
              />
            </SettingsSection>

            {/* Navigation Settings */}
            <SettingsSection title="Navigation">
              <SwitchSetting
                label="Show Breadcrumbs"
                description="Display navigation breadcrumbs on pages"
                checked={settings.navigation.showBreadcrumbs}
                onChange={(checked) => updateNavigation({ showBreadcrumbs: checked })}
              />
            </SettingsSection>
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-3 text-center">
            <p className="text-xs text-muted-foreground">
              Settings are automatically saved
            </p>
          </div>
        </div>
    </div>
  );
}
