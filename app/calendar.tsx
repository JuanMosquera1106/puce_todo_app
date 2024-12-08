import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useCalendar } from "../context/CalendarContext";
import Calendario from "../components/FiltroCalendario";
import { Picker } from "@react-native-picker/picker";
import { Materia } from "../interfaces/Materia";

const timeBlocks = [
  "7:00 a. m.",
  "8:00 a. m.",
  "9:00 a. m.",
  "10:00 a. m.",
  "11:00 a. m.",
  "12:00 p. m.",
  "1:00 p. m.",
  "2:00 p. m.",
  "3:00 p. m.",
  "4:00 p. m.",
  "5:00 p. m.",
  "6:00 p. m.",
  "7:00 p. m.",
  "8:00 p. m.",
  "9:00 p. m.",
  "10:00 p. m.",
  "11:00 p. m.",
  "12:00 a. m.",
];


const CalendarScreen: React.FC = () => {
  const { dayEvents, setDayEvents, materiasGlobales } = useCalendar();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [currentBlock, setCurrentBlock] = useState<string | null>(null);

  const currentTime = useSharedValue<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hour * 60 + minutes;
      const position = (totalMinutes - 420) * (60 / 30);
      currentTime.value = Math.max(0, position);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentTimeStyle = useAnimatedStyle(() => ({
    position: "absolute",
    top: currentTime.value,
    height: 2,
    backgroundColor: "blue",
    width: "100%",
  }));

  const handleMateriaSelection = (materia: Materia | null) => {
    const dateKey = fechaSeleccionada.toISOString().split("T")[0];
    setDayEvents((prev) => {
      const dayEvents = { ...(prev[dateKey] || {}) };
      if (currentBlock) {
        if (materia) {
          dayEvents[currentBlock] = materia;
        } else {
          delete dayEvents[currentBlock];
        }
      }
      return { ...prev, [dateKey]: dayEvents };
    });
    setCurrentBlock(null);
  };

  const renderBlocks = () => {
    const dateKey = fechaSeleccionada.toISOString().split("T")[0];
    const dayEventsForDate = dayEvents[dateKey] || {};

    return timeBlocks.map((time, index) => {
      const materia = dayEventsForDate[time];

      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setCurrentBlock(time);
          }}
          style={[
            styles.eventSlot,
            materia && { backgroundColor: materia.color },
          ]}
        >
          {currentBlock === time ? (
            <Picker
              selectedValue={materia?.event || ""}
              onValueChange={(itemValue) => {
                if (itemValue === "Eliminar") {
                  handleMateriaSelection(null);
                } else {
                  const selectedMateria = materiasGlobales.find(
                    (mat) => mat.event === itemValue
                  );
                  if (selectedMateria) {
                    handleMateriaSelection(selectedMateria);
                  }
                }
              }}
              style={styles.picker}
            >
              <Picker.Item label="Seleccionar materia" value="" />
              {materiasGlobales.map((mat, idx) => (
                <Picker.Item key={idx} label={mat.event} value={mat.event} />
              ))}
              {materia && (
                <Picker.Item label="Eliminar materia" value="Eliminar" />
              )}
            </Picker>
          ) : materia ? (
            <Text style={styles.eventText}>{String(materia.event)}</Text>
          ) : (
            <Text style={styles.emptyBlockText}>+</Text>
          )}
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Horario Semanal</Text>
        <Calendario
          fechaSeleccionada={fechaSeleccionada}
          setFechaSeleccionada={setFechaSeleccionada}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scheduleContainer}>
        <View style={styles.timeColumn}>
          {timeBlocks.map((time, index) => (
            <View key={index} style={styles.timeRow}>
              <Text style={styles.timeText}>{time}</Text>
            </View>
          ))}
        </View>
        <View style={{ position: "relative", flex: 1 }}>
          <Animated.View style={currentTimeStyle} />
          {renderBlocks()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 100,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  scheduleContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  timeColumn: {
    width: 80,
  },
  timeRow: {
    height: 60,
    justifyContent: "center",
  },
  timeText: {
    fontSize: 14,
    color: "#333",
  },
  eventSlot: {
    height: 60,
    backgroundColor: "#E8EAF6",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  eventText: {
    fontSize: 16,
    color: "#000",
  },
  emptyBlockText: {
    fontSize: 24,
    color: "#AAA",
  },
  picker: {
    width: "100%",
    backgroundColor: "#fff",
  },
});

export default CalendarScreen;
