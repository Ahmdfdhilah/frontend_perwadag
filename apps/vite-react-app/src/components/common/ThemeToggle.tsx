import { Button } from '@workspace/ui/components/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  variant?: 'default' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function ThemeToggle({ variant = 'ghost', size = 'sm', className }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={className}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}