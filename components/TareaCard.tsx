import React from "react";
import { Pressable, Text, View } from "react-native";
import { styled } from "nativewind";
import { DeleteIcon } from "../components/Icons";
import { Tarea } from "../interfaces/Tarea";

// Crear una versión estilizada de `Pressable` y `Text`
const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

type Prioridad = "Alta" | "Media" | "Baja";

const getCardStyle = (prioridad: Prioridad) => {
  switch (prioridad) {
    case "Alta":
      return "bg-red-50 border-red-100";
    case "Media":
      return "bg-yellow-50 border-yellow-100";
    case "Baja":
      return "bg-blue-50 border-blue-100";
    default:
      return "bg-gray-200 border-gray-500";
  }
};

interface TareaCardProps {
  tarea: Tarea;
  onEdit: () => void;
  onDelete: () => void;
}

const TareaCard: React.FC<TareaCardProps> = ({ tarea, onEdit, onDelete }) => {
  return (
    <StyledPressable
      className={`p-4 mb-4 border rounded-lg shadow flex-row justify-between items-center ${getCardStyle(
        tarea.prioridad,
      )}`}
      onPress={onEdit}
    >
      <View>
        <StyledText className="text-lg text-dark font-bold">
          {tarea.nombre}
        </StyledText>
        <StyledText className="text-dark/80">
          Materia: {tarea.materia}
        </StyledText>
        <StyledText className="text-dark/80">
          Prioridad: {tarea.prioridad}
        </StyledText>
        <StyledText className="text-dark/80">
          Fecha de Vencimiento: {tarea.fechaVencimiento}
        </StyledText>
      </View>

      <StyledPressable
        onPress={onDelete}
        className="ml-auto px-1 py-1 rounded active:opacity-80"
      >
        <DeleteIcon />
      </StyledPressable>
    </StyledPressable>
  );
};

export default TareaCard;
