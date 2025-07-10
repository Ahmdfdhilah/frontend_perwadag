import { Switch } from '@workspace/ui/components/switch';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {isDarkMode ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      />
    </div>
  );
}