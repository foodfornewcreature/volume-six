import React, { createContext, useState, useContext, ReactNode } from 'react';

const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;
const FONT_STEP = 2;

interface FontSizeContextType {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const FontSizeProvider = ({ children }: { children: ReactNode }) => {
  const [fontSize, setFontSize] = useState(16); // Default font size

  const increaseFontSize = () => {
    setFontSize(prevSize => Math.min(prevSize + FONT_STEP, MAX_FONT_SIZE));
  };

  const decreaseFontSize = () => {
    setFontSize(prevSize => Math.max(prevSize - FONT_STEP, MIN_FONT_SIZE));
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, increaseFontSize, decreaseFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (!context) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};