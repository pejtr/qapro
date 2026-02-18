import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette, Zap, Rocket } from "lucide-react";
import { useEffect, useState } from "react";

export type AppTheme = 'tardis' | 'warp-core';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('app-theme');
    return (saved as AppTheme) || 'tardis';
  });

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    document.documentElement.setAttribute('data-app-theme', theme);
    
    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('app-theme-change', { detail: theme }));
  }, [theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Switch theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => setTheme('tardis')}
          className="cursor-pointer"
        >
          <Zap className="mr-2 h-4 w-4 text-amber-500" />
          <span>TARDIS Aurora</span>
          {theme === 'tardis' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('warp-core')}
          className="cursor-pointer"
        >
          <Rocket className="mr-2 h-4 w-4 text-cyan-500" />
          <span>Warp Core</span>
          {theme === 'warp-core' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Hook to use current theme
export function useAppTheme() {
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('app-theme');
    return (saved as AppTheme) || 'tardis';
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
