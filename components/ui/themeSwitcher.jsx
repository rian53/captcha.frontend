'use client';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Moon, Sun } from 'lucide-react';
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from 'react';
import { useTheme } from "next-themes";
import { cn } from '@/lib/utils';

const themes = [
  {
    key: 'light',
    icon: Sun,
    label: 'Light theme',
  },
  {
    key: 'dark',
    icon: Moon,
    label: 'Dark theme',
  },
];

export const ThemeSwitcher = ({
  value,
  onChange,
  defaultValue = 'light',
  className,
}) => {
  const { theme: currentTheme, setTheme: setSystemTheme, resolvedTheme } = useTheme();
  const [theme, setTheme] = useControllableState({
    defaultProp: defaultValue,
    prop: value,
    onChange,
  });
  const [mounted, setMounted] = useState(false);

  const handleThemeClick = useCallback(
    (themeKey) => {
      setTheme(themeKey);
      setSystemTheme(themeKey);
    },
    [setTheme, setSystemTheme]
  );

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Sincronizar com o tema atual do sistema
    if (currentTheme && !value) {
      setTheme(currentTheme);
    }
  }, [currentTheme, setTheme, value]);

  if (!mounted) {
    return null;
  }

  // Determinar a classe de ring baseada no tema resolvido
  const getRingClass = () => {
    return resolvedTheme === 'dark' ? 'ring-neutral-800' : 'ring-neutral-200';
  };

  return (
    <div
      className={cn(
        'relative isolate flex h-8 rounded-full bg-background p-1 ring-1',
        getRingClass(),
        className
      )}
    >
      {themes.map(({ key, icon: Icon, label }) => {
        const isActive = (currentTheme || theme) === key;
        return (
          <button
            aria-label={label}
            className="relative h-6 w-6 rounded-full"
            key={key}
            onClick={() => handleThemeClick(key)}
            type="button"
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full bg-secondary"
                layoutId="activeTheme"
                transition={{ type: 'spring', duration: 0.5 }}
              />
            )}
            <Icon
              className={cn(
                'relative z-10 m-auto h-4 w-4',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
