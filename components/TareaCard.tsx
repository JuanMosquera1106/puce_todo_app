import React, { useState, useEffect, useRef } from "react";
import {
  Pressable,
  Text,
  View,
  Alert,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { styled } from "nativewind";
import { Tarea } from "../interfaces/Tarea";
import { FontAwesome } from "@expo/vector-icons";
import { useCalendar } from "../context/CalendarContext";

const StyledPressable = styled(Pressable);
const StyledText = styled(Text);

interface TareaCardProps {
  tarea: Tarea;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onPlay: () => void;
  completada: boolean;
}

const getColorByPriority = (prioridad: string, completada: boolean) => {
  if (completada) return styles.itemCompleted;

  switch (prioridad) {
    case "Alta":
      return styles.itemHighPriority;
    case "Media":
      return styles.itemMediumPriority;
    case "Baja":
      return styles.itemLowPriority;
    default:
      return styles.itemDefault;
  }
};

const TareaCard: React.FC<TareaCardProps> = ({
  tarea,
  onEdit,
  onDelete,
  onComplete,
  onPlay,
  completada,
}) => {
  const { materiasGlobales } = useCalendar();

  const nombreMateria =
    materiasGlobales.find((materia) => materia.id === tarea.materia)?.event ||
    "Ninguna";

  const [isCompleted, setIsCompleted] = useState(completada);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isCompleted) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(0);
    }
  }, [isCompleted, animatedValue]);

  const checkmarkOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
    onComplete();
  };

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

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <Pressable onPress={confirmDelete} style={styles.deleteButton}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <FontAwesome name="trash" size={24} color="white" />
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <StyledPressable
        className={`p-4 mb-4 rounded-lg shadow-lg flex-row justify-between items-center ${getColorByPriority(tarea.prioridad, isCompleted).backgroundColor}`}
        style={[getColorByPriority(tarea.prioridad, isCompleted), styles.card]}
        onPress={onEdit}
      >
        <View style={styles.itemLeft}>
          <Pressable
            onPress={handleComplete}
            style={[styles.square, isCompleted && { backgroundColor: "#666" }]}
          >
            <Animated.View
              style={[styles.checkmark, { opacity: checkmarkOpacity }]}
            >
              <FontAwesome name="check" size={20} color="white" />
            </Animated.View>
          </Pressable>
          <View style={styles.textContainer}>
            <StyledText
              style={[styles.itemText, isCompleted && styles.itemTextCompleted]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {tarea.nombre}
            </StyledText>
            <StyledText
              style={[
                styles.itemSubText,
                isCompleted && styles.itemTextCompleted,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Materia: {nombreMateria}
            </StyledText>
          </View>
        </View>

        <View style={styles.iconsContainer}>
          <StyledPressable onPress={onPlay} className="p-3">
            <FontAwesome name="play-circle" size={30} color="black" />
          </StyledPressable>
        </View>
      </StyledPressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 5,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  square: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderColor: "#666",
    backgroundColor: "transparent",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkmark: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 12,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  itemSubText: {
    fontSize: 14,
    color: "#666",
  },
  itemTextCompleted: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemCompleted: {
    backgroundColor: "#f0f0f0",
    borderLeftColor: "#999",
  },
  itemHighPriority: {
    backgroundColor: "#ffebeb",
    borderLeftColor: "#ff5f5f",
  },
  itemMediumPriority: {
    backgroundColor: "#fff7e0",
    borderLeftColor: "#ffd700",
  },
  itemLowPriority: {
    backgroundColor: "#e7f5ff",
    borderLeftColor: "#55BCF6",
  },
  itemDefault: {
    backgroundColor: "#f0f0f0",
    borderLeftColor: "#ccc",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: "84%",
    backgroundColor: "red",
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 6,
  },
});

export default TareaCard;
