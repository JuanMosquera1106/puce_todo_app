import React from "react";
import { Text } from "react-native";
import { styled } from "nativewind";

// Crear una versión estilizada de `Text`
const StyledText = styled(Text);

const EmptyState = () => (
  <StyledText className="text-dark/80">No hay tareas disponibles</StyledText>
);

export default EmptyState;
