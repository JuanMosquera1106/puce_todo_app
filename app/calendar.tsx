import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  PanResponder,
  Animated,
} from "react-native";
import { useCalendar } from "../context/CalendarContext";
import Calendario from "../components/FiltroSemanal";
import { Materia } from "../interfaces/Materia";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";

const timeBlocks = [
  "7:00 a. m.",
  "7:30 a. m.",
  "8:00 a. m.",
  "8:30 a. m.",
  "9:00 a. m.",
  "9:30 a. m.",
  "10:00 a. m.",
  "10:30 a. m.",
  "11:00 a. m.",
  "11:30 a. m.",
  "12:00 p. m.",
  "12:30 p. m.",
  "1:00 p. m.",
  "1:30 p. m.",
  "2:00 p. m.",
  "2:30 p. m.",
  "3:00 p. m.",
  "3:30 p. m.",
  "4:00 p. m.",
  "4:30 p. m.",
  "5:00 p. m.",
  "5:30 p. m.",
  "6:00 p. m.",
  "6:30 p. m.",
  "7:00 p. m.",
  "7:30 p. m.",
  "8:00 p. m.",
  "8:30 p. m.",
  "9:00 p. m.",
  "9:30 p. m.",
  "10:00 p. m.",
  "10:30 p. m.",
  "11:00 p. m.",
  "11:30 p. m.",
  "12:00 a. m.",
];

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const Header: React.FC<{
  fechaSeleccionada: Date;
  setFechaSeleccionada: (fecha: Date) => void;
}> = ({ fechaSeleccionada, setFechaSeleccionada }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Gestiona tu tiempo aquí!</Text>
    <Calendario
      fechaSeleccionada={fechaSeleccionada}
      setFechaSeleccionada={setFechaSeleccionada}
    />
  </View>
);

const CalendarScreen: React.FC = () => {
  const { dayEvents, setDayEvents, materiasGlobales } = useCalendar();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [draggingHeight, setDraggingHeight] = useState<number>(1);
  const [dragStartY, setDragStartY] = useState<number>(0);
  const [dragging, setDragging] = useState<boolean>(false);

  const formattedDate = formatDate(fechaSeleccionada);
  const materias: { [key: string]: Materia } = dayEvents[formattedDate] || {};

  const handleInputChange = (time: string,materiaSeleccionada: Materia | null) => {
    setDayEvents((prevDayEvents) => {
      const updatedMaterias = { ...prevDayEvents[formattedDate] };
      const currentIndex = timeBlocks.indexOf(time);
      const maxBlocks = timeBlocks.length - currentIndex;

      if (materiaSeleccionada) {
        // Ajustar la duración al rango permitido
        const adjustedDuration = Math.min(draggingHeight, maxBlocks);
    

        // Evitar la creación de bloques fuera de rango
      if (currentIndex + adjustedDuration > timeBlocks.length) {
        return prevDayEvents; // No hacer cambios si excede el límite
      }

        updatedMaterias[time] = {
            ...materiaSeleccionada,
            time,
            duration: adjustedDuration,
        };

        // Eliminar bloques superpuestos si la duración cambia
        for (let i = 1; i < adjustedDuration; i++) {
            const nextBlock = timeBlocks[currentIndex + i];
            if (nextBlock) delete updatedMaterias[nextBlock];
        }
    } else {
        delete updatedMaterias[time];
    }

    // Limpiar bloques vacíos y fuera del rango
    Object.keys(updatedMaterias).forEach((key) => {
      const index = timeBlocks.indexOf(key);
      if (index === -1 || !updatedMaterias[key]) {
        delete updatedMaterias[key];
      }
    });

    return { ...prevDayEvents, [formattedDate]: updatedMaterias };
    });
  };

  const handleBlockClick = (time: string) => {
    setSelectedBlock(time);
    setDraggingHeight(materias[time]?.duration || 1);
    setDragging(false);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (_, gestureState) => {
      setDragging(true);
      setDragStartY(gestureState.y0);
    },
    onPanResponderMove: (_, gestureState) => {
      if (!selectedBlock) return;
      const blockHeight = 60;
      const currentIndex = timeBlocks.indexOf(selectedBlock);
      const draggedBlocks = Math.round(
        (gestureState.moveY - dragStartY) / blockHeight
      );

      // Limitar el nuevo bloque al rango permitido
      let newHeight = Math.max(
        1,
        (materias[selectedBlock]?.duration || 1) + draggedBlocks
      );

    // Restringir la expansión más allá del último bloque permitido
    const maxHeight = timeBlocks.length - currentIndex; // Bloques restantes desde el actual
    if (currentIndex + newHeight > timeBlocks.length) {
        newHeight = maxHeight; // Restringir al máximo permitido
    }

      setDraggingHeight(newHeight);
    },
    onPanResponderRelease: () => {
      if (selectedBlock) {
        const currentIndex = timeBlocks.indexOf(selectedBlock);
        const adjustedHeight = Math.min(
          draggingHeight,
          timeBlocks.length - currentIndex
        );
        
        // Sobreescribir bloques ocupados al expandir
    for (let i = 1; i < adjustedHeight; i++) {
      const nextBlock = timeBlocks[currentIndex + i];
      if (nextBlock && materias[nextBlock]) {
        handleInputChange(nextBlock, null); // Eliminar bloque superpuesto
      }
    }

    handleInputChange(selectedBlock, materias[selectedBlock]);

      }
      setDragging(false);
      setSelectedBlock(null);
    },
  });

  return (
    <View style={styles.container}>
      <Header
        fechaSeleccionada={fechaSeleccionada}
        setFechaSeleccionada={setFechaSeleccionada}
      />
      <ScrollView>
        <View style={styles.scheduleContainer}>
          <View style={styles.timeColumn}>
            {timeBlocks.map((time, index) => (
              <View key={index} style={styles.timeRow}>
                <Text style={styles.timeText}>{time}</Text>
              </View>
            ))}
          </View>
          <View style={styles.eventsColumn}>
            {timeBlocks.map((time, index) => {
              const materia = materias[time];
              const isSelected = selectedBlock === time;

              // Verificar si este bloque está ocupado por un evento más largo
              const occupyingEvent = Object.values(materias).find(
                (mat) =>
                  timeBlocks.indexOf(mat.time) <= index &&
                  index < timeBlocks.indexOf(mat.time) + mat.duration
              );

              // Validar que los bloques estén dentro del rango permitido
              if (materia && index + materia.duration > timeBlocks.length) {
                return null; // No renderizar bloques fuera del rango
              }

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.eventSlot,
                    materia
                      ? {
                        height: Math.min(
                          materia.duration * 60,
                          (timeBlocks.length - index) * 60
                      ), // Restringe la altura
                          backgroundColor: materia.color,
                          borderRadius: 12,
                        }
                      : { height: 60 },
                  ]}
                  onPress={() => handleBlockClick(time)}
                >
                  {isSelected ? (
                    <Animated.View
                      style={[
                        { height: draggingHeight * 60 },
                        styles.dragContainer,
                      ]}
                    >
                      <Picker
                        selectedValue={materia ? materia.event : "Seleccionar"}
                        onValueChange={(itemValue) => {
                          if (itemValue === "Eliminar") {
                            handleInputChange(time, null);
                          } else if (itemValue !== "Seleccionar") {
                            const materiaSeleccionada = materiasGlobales.find(
                              (mat) => mat.event === itemValue
                            );
                            if (materiaSeleccionada) {
                              handleInputChange(time, materiaSeleccionada);
                            }
                          }
                        }}
                        style={styles.picker}
                        dropdownIconColor="#ffff"
                      >
                        <Picker.Item
                          label="Seleccionar materia"
                          value="Seleccionar"
                        />
                        {materiasGlobales.map((mat, idx) => (
                          <Picker.Item
                            key={idx}
                            label={mat.event}
                            value={mat.event}
                          />
                        ))}
                        <Picker.Item
                          label="Eliminar materia"
                          value="Eliminar"
                        />
                      </Picker>
                      <View
                        {...panResponder.panHandlers}
                        style={styles.dragHandle}
                      >
                        <MaterialIcons
                          name="drag-handle"
                          size={32}
                          color="#666"
                        />
                      </View>
                    </Animated.View>
                  ) : (
                    materia && (
                      <Text style={styles.eventText}>{materia.event}</Text>
                    )
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingBottom: 20 },
  header: { paddingTop: 30, paddingBottom: 10, backgroundColor: "#ffffff" },
  headerTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  scheduleContainer: { flexDirection: "row", flex: 1, marginTop: 10 },
  timeColumn: { width: 100, paddingLeft: 20 },
  timeRow: { height: 60, justifyContent: "center" },
  timeText: { fontSize: 16, color: "#333" },
  eventsColumn: { flex: 1, marginLeft: 10 },
  eventSlot: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    position: "relative",
  },
  eventText: { fontSize: 18, color: "#000", marginLeft: 10, marginTop: 15 },
  dragContainer: { backgroundColor: "#e3f2fd", borderRadius: 8 },
  picker: { backgroundColor: "#fff", padding: 10 },
  dragHandle: { position: "absolute", bottom: 5, right: 10 },
});

export default CalendarScreen;
