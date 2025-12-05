import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="w-full justify-start" disabled>
        <Sun className="h-4 w-4 mr-2" />
        Carregando...
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-full justify-start text-foreground border-border hover:bg-accent transition-colors shadow-sm hover:shadow-md text-sm md:text-base py-2 md:py-2.5"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-4 w-4 mr-2" />
          Modo Claro
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 mr-2" />
          Modo Escuro
        </>
      )}
    </Button>
  );
}
