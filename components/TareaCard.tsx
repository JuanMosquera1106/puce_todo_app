import React from "react";
import { Pressable, Text, View, Alert } from "react-native";
import { styled } from "nativewind";
import { DeleteIcon, PlayIcon } from "../components/Icons";
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
  onPlay: () => void;
}

const TareaCard: React.FC<TareaCardProps> = ({
  tarea,
  onEdit,
  onDelete,
  onPlay,
}) => {
  // Función para confirmar la eliminación de la tarea
  const confirmDelete = () => {
    Alert.alert(
      "Eliminar tarea",
      "¿Estás seguro de que quieres eliminar esta tarea?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: onDelete },
      ],
    );
  };

  return (
    <StyledPressable
      className={`p-4 mb-4 border rounded-lg shadow flex-row justify-between items-center ${getCardStyle(
        tarea.prioridad,
      )}`}
      onPress={onEdit}
    >
      {/* Contenedor para la información de la tarea */}
      <View style={{ flex: 1, paddingRight: 8 }}>
        <StyledText
          className="text-lg text-dark font-bold"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {tarea.nombre}
        </StyledText>
        <StyledText
          className="text-dark/80"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
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

      {/* Botón de Eliminar */}
      <StyledPressable
        onPress={confirmDelete} // Al presionar, abre la alerta de confirmación
        className="ml-4 px-2 py-2 rounded active:opacity-80 bg-red-100"
      >
        <DeleteIcon />
      </StyledPressable>
    </StyledPressable>
  );
};

export default TareaCard;
