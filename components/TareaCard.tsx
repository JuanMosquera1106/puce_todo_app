import React from "react";
import { Pressable, Text, View } from "react-native";
import { styled } from "nativewind";
import { DeleteIcon, PlayIcon } from "../components/Icons"; // Importar el ícono de Play
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
  onPlay: () => void; // Añadimos una nueva prop para manejar la acción de "play"
}

const TareaCard: React.FC<TareaCardProps> = ({ tarea, onEdit, onDelete, onPlay }) => {
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

      {/* Botón de Play */}
      <StyledPressable
        onPress={onPlay}
        className="ml-4 px-2 py-2 rounded active:opacity-80"
      >
        <PlayIcon />
      </StyledPressable>

      <StyledPressable
        onPress={onDelete}
        className="ml-4 px-2 py-2 rounded active:opacity-80"
      >
        <DeleteIcon />
      </StyledPressable>
    </StyledPressable>
  );
};

export default TareaCard;
