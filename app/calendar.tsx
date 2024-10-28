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
import Calendario from "../components/FiltroSemanal"; // Componente del calendario
import { Materia } from "../interfaces/Materia";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

// Definir el array de bloques de tiempo
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

// Definir la función para formatear la fecha
const formatDate = (date: Date) => date.toISOString().split("T")[0];

// Definir el componente Header
const Header: React.FC<{
  fechaSeleccionada: Date;
  setFechaSeleccionada: (fecha: Date) => void;
}> = ({ fechaSeleccionada, setFechaSeleccionada }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Gestiona tu tiempo aquí!</Text>
      <Calendario
        fechaSeleccionada={fechaSeleccionada}
        setFechaSeleccionada={setFechaSeleccionada}
      />
    </View>
  );
};

const CalendarScreen: React.FC = () => {
  const { dayEvents, setDayEvents, materiasGlobales } = useCalendar();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [draggingHeight, setDraggingHeight] = useState<number>(1);

  const formattedDate = formatDate(fechaSeleccionada);
  const materias: { [key: string]: Materia } = dayEvents[formattedDate] || {};

  const handleInputChange = (
    time: string,
    materiaSeleccionada: Materia | null,
  ) => {
    setDayEvents((prevDayEvents) => {
      const updatedMaterias: { [key: string]: Materia } = {
        ...prevDayEvents[formattedDate],
      };

      if (materiaSeleccionada) {
        updatedMaterias[time] = {
          ...materiaSeleccionada,
          time,
          duration: draggingHeight,
        };
      } else {
        delete updatedMaterias[time];
      }

      return { ...prevDayEvents, [formattedDate]: updatedMaterias };
    });
  };

  const handleBlockClick = (time: string, index: number) => {
    if (time === "12:00 a. m.") {
      return; // No hacer nada si el bloque es 12:00 a. m.
    }

    setSelectedBlock(time);
    setDraggingHeight(materias[time]?.duration || 1);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      const blockHeight = 60;
      const draggedBlocks = Math.round(gestureState.dy / blockHeight);

      // Limitar la altura del evento para que no se extienda más allá de las 12:00 a. m.
      const newHeight = Math.max(1, draggingHeight + draggedBlocks);
      const maxBlocks = timeBlocks.length - timeBlocks.indexOf("11:00 p. m."); // Limita hasta las 12:00 a. m.
      setDraggingHeight(Math.min(newHeight, maxBlocks));
    },
    onPanResponderRelease: () => {
      if (selectedBlock) {
        setDayEvents((prevDayEvents) => {
          const updatedMaterias = { ...prevDayEvents[formattedDate] };
          if (updatedMaterias[selectedBlock]) {
            updatedMaterias[selectedBlock].duration = draggingHeight;
          }
          return { ...prevDayEvents, [formattedDate]: updatedMaterias };
        });
      }
      setDraggingHeight(1);
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
                <FontAwesome name="clock-o" size={16} color="#666" />
                <Text style={styles.timeText}>{time}</Text>
              </View>
            ))}
          </View>
          <View style={styles.eventsColumn}>
            {timeBlocks.map((time, index) => {
              const materia = materias[time];
              const isSelected = selectedBlock === time;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.eventSlot,
                    materia
                      ? {
                          height: materia.duration * 60,
                          backgroundColor: materia.color,
                          borderRadius: 12,
                        }
                      : { height: 60 },
                  ]}
                  onPress={() => handleBlockClick(time, index)}
                >
                  {isSelected ? (
                    <Animated.View style={{ height: draggingHeight * 60 }}>
                      <Picker
                        selectedValue={materia ? materia.event : "Seleccionar"}
                        onValueChange={(itemValue) => {
                          if (itemValue === "Eliminar") {
                            handleInputChange(time, null); // Eliminar la materia
                          } else if (itemValue !== "Seleccionar") {
                            const materiaSeleccionada = materiasGlobales.find(
                              (mat) => mat.event === itemValue,
                            );
                            if (materiaSeleccionada) {
                              handleInputChange(time, materiaSeleccionada);
                            }
                          }
                        }}
                        style={styles.picker}
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
  header: {
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  scheduleContainer: { flexDirection: "row", flex: 1, marginTop: 10 },
  timeColumn: { width: 100, paddingLeft: 20 },
  timeRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    height: 60,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  timeText: { color: "#333", fontSize: 16, marginLeft: 10 },
  eventsColumn: { flex: 1, marginLeft: 10 },
  eventSlot: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 5,
    position: "relative",
    overflow: "hidden",
  },
  picker: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  eventText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  dragHandle: {
    alignItems: "center",
    position: "absolute",
    bottom: 5,
    right: 10,
  },
});

export default CalendarScreen;
