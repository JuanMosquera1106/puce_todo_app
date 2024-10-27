// FontContext.tsx
import React, { createContext, useContext } from "react";
import { Text, TextProps } from "react-native";

const FontContext = createContext<TextProps["style"] | undefined>(undefined);

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <FontContext.Provider value={{ fontFamily: "AtkinsonHyperlegible_400Regular" }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => useContext(FontContext);
