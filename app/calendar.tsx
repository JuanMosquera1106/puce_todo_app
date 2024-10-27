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
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

const timeBlocks = [
  "7:00 a. m.",
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
}> = ({ fechaSeleccionada, setFechaSeleccionada }) => {
  return (
    <View style={styles.header}>
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
  const [startIndex, setStartIndex] = useState<number | null>(null);

  const formattedDate = formatDate(fechaSeleccionada);
  const materias: { [key: string]: Materia } = dayEvents[formattedDate] || {};

  const handleInputChange = (time: string, materiaSeleccionada: Materia) => {
    setDayEvents((prevDayEvents) => {
      const updatedMaterias: { [key: string]: Materia } = {
        ...prevDayEvents[formattedDate],
        [time]: {
          ...materiaSeleccionada,
          time,
          duration: draggingHeight,
        },
      };
      return {
        ...prevDayEvents,
        [formattedDate]: updatedMaterias,
      };
    });
  };

  const handleBlockClick = (time: string, index: number) => {
    setSelectedBlock(time);
    setStartIndex(index);
    setDraggingHeight(materias[time]?.duration || 1);
  };

  const handlePanResponderMove = (e: any, gestureState: any) => {
    const blockHeight = 60;
    const draggedBlocks = Math.round(gestureState.dy / blockHeight);
    const newHeight = Math.max(1, draggingHeight + draggedBlocks);
    setDraggingHeight(newHeight);
  };

  const handlePanResponderRelease = () => {
    if (selectedBlock !== null && startIndex !== null) {
      setDayEvents((prevDayEvents) => {
        const updatedMaterias = { ...prevDayEvents[formattedDate] };
        const timeKey = timeBlocks[startIndex];
        if (updatedMaterias[timeKey]) {
          updatedMaterias[timeKey].duration = draggingHeight;
        }
        return {
          ...prevDayEvents,
          [formattedDate]: updatedMaterias,
        };
      });
    }
    setDraggingHeight(1);
    setStartIndex(null);
    setSelectedBlock(null);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: handlePanResponderRelease,
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
                    materia ? {
                      height: materia.duration * 60,
                      backgroundColor: materia.color,
                      borderRadius: 12,
                    } : { height: 60 },
                  ]}
                  onPress={() => handleBlockClick(time, index)}
                >
                  {isSelected ? (
                    <Animated.View style={{ height: draggingHeight * 60 }}>
                      <Picker
                        selectedValue={materia ? materia.event : null}
                        onValueChange={(itemValue) => {
                          const materiaSeleccionada = materiasGlobales.find(
                            (mat) => mat.event === itemValue
                          );
                          if (materiaSeleccionada) {
                            handleInputChange(time, materiaSeleccionada);
                          }
                        }}
                        style={styles.picker}
                      >
                        <Picker.Item label="Selecciona una materia" value={null} />
                        {materiasGlobales.map((mat, idx) => (
                          <Picker.Item key={idx} label={mat.event} value={mat.event} />
                        ))}
                      </Picker>
                      <View {...panResponder.panHandlers} style={styles.dragHandle}>
                        <MaterialIcons name="drag-handle" size={24} color="#666" />
                      </View>
                    </Animated.View>
                  ) : (
                    materia && <Text style={styles.eventText}>{materia.event}</Text>
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
    fontSize: 16,
  },
  dragHandle: {
    alignItems: "center",
    position: "absolute",
    bottom: 5,
    right: 10,
  },
});

export default CalendarScreen;
