import React from "react";
import { Pressable } from "react-native";
import { styled } from "nativewind";
import { AddIcon } from "../components/Icons";

const StyledPressable = styled(Pressable);

interface BotonAgregarTareaProps {
  onPress: () => void;
}

const BotonAgregarTarea: React.FC<BotonAgregarTareaProps> = ({ onPress }) => {
  return (
    <StyledPressable
      onPress={onPress}
      className="bg-gray-200 w-16 h-16 rounded-full active:opacity-80 flex items-center justify-center relative bottom-20 right-1"
    >
      <AddIcon />
    </StyledPressable>
  );
};

export default BotonAgregarTarea;
