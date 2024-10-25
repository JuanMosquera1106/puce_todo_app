import { View, ViewProps } from "react-native";
import { ReactNode } from "react";
import { styled } from "nativewind"; // Usa `styled` en lugar de `tw`

interface ScreenProps extends ViewProps {
  children: ReactNode; // Definimos el tipo de las props como ReactNode para los hijos
}

// Usamos styled para crear un View estilizado
const StyledView = styled(View);

export function Screen({ children, ...rest }: ScreenProps) {
  return (
    <StyledView className="flex-1 bg-black pt-4 px-2" {...rest}>
      {children}
    </StyledView>
  );
}
