<<<<<<< HEAD
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
import { styled } from "nativewind";
import { DeleteIcon } from "../components/Icons";
import { Tarea } from "../interfaces/Tarea";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
=======
import React, { useState, useEffect, useRef } from 'react';
import { Pressable, Text, View, Alert, Animated, Easing, StyleSheet } from 'react-native';
import { styled } from 'nativewind';
import { DeleteIcon } from '../components/Icons';
import { Tarea } from '../interfaces/Tarea';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
>>>>>>> fd59d14e718270452c6c2e64e420788942320673

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
<<<<<<< HEAD
    case "Alta":
      return styles.itemHighPriority;
    case "Media":
      return styles.itemMediumPriority;
    case "Baja":
=======
    case 'Alta':
      return styles.itemHighPriority;
    case 'Media':
      return styles.itemMediumPriority;
    case 'Baja':
>>>>>>> fd59d14e718270452c6c2e64e420788942320673
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
  }, [isCompleted]);

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
<<<<<<< HEAD
      ],
=======
      ]
>>>>>>> fd59d14e718270452c6c2e64e420788942320673
    );
  };

  return (
    <StyledPressable
      className={`p-4 mb-4 rounded-lg shadow-lg flex-row justify-between items-center ${getColorByPriority(tarea.prioridad, isCompleted).backgroundColor}`}
      style={[getColorByPriority(tarea.prioridad, isCompleted), styles.card]}
      onPress={onEdit}
    >
      <View style={styles.itemLeft}>
<<<<<<< HEAD
        <Pressable
          onPress={handleComplete}
          style={[styles.square, isCompleted && { backgroundColor: "#666" }]}
        >
          <Animated.View
            style={[styles.checkmark, { opacity: checkmarkOpacity }]}
          >
=======
        <Pressable onPress={handleComplete} style={[styles.square, isCompleted && { backgroundColor: '#666' }]}>
          <Animated.View style={[styles.checkmark, { opacity: checkmarkOpacity }]}>
>>>>>>> fd59d14e718270452c6c2e64e420788942320673
            <FontAwesome name="check" size={20} color="white" />
          </Animated.View>
        </Pressable>
        <View style={styles.textContainer}>
          <StyledText
            style={[styles.itemText, isCompleted && styles.itemTextCompleted]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
<<<<<<< HEAD
            {tarea.nombre.length > 15
              ? `${tarea.nombre.substring(0, 15)}...`
              : tarea.nombre}
          </StyledText>
          <StyledText
            style={[
              styles.itemSubText,
              isCompleted && styles.itemTextCompleted,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Materia:{" "}
            {tarea.materia.length > 20
              ? `${tarea.materia.substring(0, 20)}...`
              : tarea.materia}
=======
            {tarea.nombre}
          </StyledText>
          <StyledText
            style={[styles.itemSubText, isCompleted && styles.itemTextCompleted]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Materia: {tarea.materia}
>>>>>>> fd59d14e718270452c6c2e64e420788942320673
          </StyledText>
        </View>
      </View>

      <View style={styles.iconsContainer}>
        <StyledPressable onPress={onPlay} className="px-3 py-2">
          <FontAwesome6 name="circle-play" size={30} color="black" />
        </StyledPressable>
        <StyledPressable onPress={confirmDelete} className="ml-3 px-3">
          <DeleteIcon />
        </StyledPressable>
      </View>
    </StyledPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 5,
  },
  itemLeft: {
<<<<<<< HEAD
    flexDirection: "row",
    alignItems: "center",
=======
    flexDirection: 'row',
    alignItems: 'center',
>>>>>>> fd59d14e718270452c6c2e64e420788942320673
  },
  square: {
    width: 28,
    height: 28,
    borderWidth: 2,
<<<<<<< HEAD
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
=======
    borderColor: '#666',
    backgroundColor: 'transparent',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmark: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
>>>>>>> fd59d14e718270452c6c2e64e420788942320673
  },
  textContainer: {
    marginLeft: 12,
  },
  itemText: {
    fontSize: 18,
<<<<<<< HEAD
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
=======
    fontWeight: '600',
    color: '#333',
  },
  itemSubText: {
    fontSize: 14,
    color: '#666',
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCompleted: {
    backgroundColor: '#f0f0f0',
    borderLeftColor: '#999',
  },
  itemHighPriority: {
    backgroundColor: '#ffebeb',
    borderLeftColor: '#ff5f5f',
  },
  itemMediumPriority: {
    backgroundColor: '#fff7e0',
    borderLeftColor: '#ffd700',
  },
  itemLowPriority: {
    backgroundColor: '#e7f5ff',
    borderLeftColor: '#55BCF6',
  },
  itemDefault: {
    backgroundColor: '#f0f0f0',
    borderLeftColor: '#ccc',
>>>>>>> fd59d14e718270452c6c2e64e420788942320673
  },
});

export default TareaCard;
