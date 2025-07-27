import React, { createContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeType = "light" | "dark";

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>("light");

  useEffect(() => {
    // Carregar tema salvo
    AsyncStorage.getItem("appTheme").then((saved) => {
      if (saved === "dark" || saved === "light") setTheme(saved);
    });
  }, []);

  const toggleTheme = () => {
    const novoTema = theme === "light" ? "dark" : "light";
    setTheme(novoTema);
    AsyncStorage.setItem("appTheme", novoTema);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
