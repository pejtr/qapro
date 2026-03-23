import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette, Zap, Rocket, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export type AppTheme = 'pip-boy' | 'tardis' | 'warp-core';

const THEMES: { id: AppTheme; label: string; description: string; color: string; icon: typeof Monitor }[] = [
  { id: 'pip-boy',    label: 'PIP-BOY',       description: 'Fosforová zelená / CRT terminál', color: '#39ff14', icon: Monitor },
  { id: 'tardis',    label: 'TARDIS Aurora',  description: 'Jantarová / Časový vortex',       color: '#f59e0b', icon: Zap },
  { id: 'warp-core', label: 'Warp Core',      description: 'Azurová / Plasma reaktor',        color: '#06b6d4', icon: Rocket },
];

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('app-theme');
    return (saved as AppTheme) || 'pip-boy';
  });

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    document.documentElement.setAttribute('data-app-theme', theme);
    // Ensure dark mode is always active
    document.documentElement.classList.add('dark');
    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('app-theme-change', { detail: theme }));
  }, [theme]);

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-app-theme', theme);
    document.documentElement.classList.add('dark');
  }, []);

  const current = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Palette className="h-4 w-4" />
          {/* Active theme color dot */}
          <span
            className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full border border-background"
            style={{ backgroundColor: current.color }}
          />
          <span className="sr-only">Přepnout téma</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
          Téma rozhraní
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEMES.map((t) => {
          const Icon = t.icon;
          return (
            <DropdownMenuItem
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="cursor-pointer flex items-start gap-3 py-2"
            >
              <div className="mt-0.5 flex-shrink-0">
                <Icon className="h-4 w-4" style={{ color: t.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{t.label}</span>
                  {theme === t.id && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: t.color + '20', color: t.color }}>
                      aktivní
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{t.description}</p>
              </div>
              {/* Color swatch */}
              <div
                className="mt-1 h-3 w-3 rounded-full flex-shrink-0 ring-1 ring-border"
                style={{ backgroundColor: t.color }}
              />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Hook to use current theme
export function useAppTheme() {
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('app-theme');
    return (saved as AppTheme) || 'pip-boy';
  });

  useEffect(() => {
    const handleThemeChange = (e: CustomEvent<AppTheme>) => {
      setTheme(e.detail);
    };

    window.addEventListener('app-theme-change', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('app-theme-change', handleThemeChange as EventListener);
    };
  }, []);

  return theme;
}
