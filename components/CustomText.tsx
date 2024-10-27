// CustomText.tsx
import React from "react";
import { Text, TextProps } from "react-native";
import { useFont } from "../context/FontContext"; // Asegúrate de la ruta

const CustomText: React.FC<TextProps> = ({ style, children, ...props }) => {
  const fontStyle = useFont();
  return (
    <Text style={[fontStyle, style]} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;
