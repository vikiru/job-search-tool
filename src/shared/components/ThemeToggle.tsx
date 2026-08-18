/* oxlint-disable react/react-compiler -- mounted state prevents an SSR/client theme-label mismatch. */

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/shared/components/ThemeProvider';
import { Button } from '@/shared/components/ui/button';

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      aria-label={mounted && isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="touch-target relative size-11 rounded-full text-muted-foreground transition-colors hover:bg-transparent hover:text-primary motion-reduce:transition-none dark:hover:bg-transparent"
      onClick={toggleTheme}
      size="icon"
      type="button"
      variant="ghost"
    >
      <Sun
        aria-hidden="true"
        className="size-icon-md rotate-0 scale-100 transition-all motion-reduce:transition-none dark:-rotate-90 dark:scale-0"
      />
      <Moon
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 size-icon-md -translate-x-1/2 -translate-y-1/2 rotate-90 scale-0 transition-all motion-reduce:transition-none dark:rotate-0 dark:scale-100"
      />
    </Button>
  );
}

export { ThemeToggle };
