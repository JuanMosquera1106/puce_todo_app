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
import { useTareas } from "../context/TareasContext"; // Usando el contexto combinado
import Calendario from "../components/FiltroCalendario";
import { Picker } from "@react-native-picker/picker";
import { Tarea } from "../interfaces/Tarea";

const timeBlocks = [
  "7:00 a. m.", "8:00 a. m.", "9:00 a. m.", "10:00 a. m.", "11:00 a. m.",
  "12:00 p. m.", "1:00 p. m.", "2:00 p. m.", "3:00 p. m.", "4:00 p. m.",
  "5:00 p. m.", "6:00 p. m.", "7:00 p. m.", "8:00 p. m.", "9:00 p. m.",
  "10:00 p. m.", "11:00 p. m.", "12:00 a. m."
];

const CalendarScreen: React.FC = () => {
  const { dayEvents, setDayEvents, tareas } = useTareas();  // Usamos TareasContext
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [currentBlock, setCurrentBlock] = useState<string | null>(null);
  const currentTime = useSharedValue<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const totalMinutes = now.getHours() * 60 + now.getMinutes();
      currentTime.value = Math.max(0, (totalMinutes - 420) * (60 / 30));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentTimeStyle = useAnimatedStyle(() => ({
    position: "absolute", top: currentTime.value, height: 2, backgroundColor: "blue", width: "100%"
  }));

  const handleTareaSelection = (tarea: Tarea | null, time: string) => {
    const dateKey = fechaSeleccionada.toISOString().split("T")[0];
    setDayEvents((prev) => {
      const updatedDayEvents = { ...(prev[dateKey] || {}) };
      updatedDayEvents[time] = tarea;  // Asignando la tarea al bloque de tiempo
      return { ...prev, [dateKey]: updatedDayEvents };
    });
    setCurrentBlock(null);
  };

  const renderBlocks = () => {
    const dateKey = fechaSeleccionada.toISOString().split("T")[0];
    const dayEventsForDate = dayEvents[dateKey] || {};

    return timeBlocks.map((time, index) => {
      const tarea = dayEventsForDate[time];

      return (
        <TouchableOpacity
          key={index}
          onPress={() => setCurrentBlock(time)}  // Al presionar, selecciona el bloque de tiempo
          style={[
            styles.eventSlot,
            tarea && { backgroundColor: tarea.prioridad === "Alta" ? "#FFCCCB" : tarea.prioridad === "Media" ? "#FFD700" : "#90EE90" }
          ]}
        >
          {currentBlock === time ? (
            <Picker
              selectedValue={tarea?.nombre || ""}
              onValueChange={(itemValue) => {
                const selectedTarea = tareas.find(t => t.nombre === itemValue);
                handleTareaSelection(selectedTarea || null, time);  // Asigna o elimina la tarea
              }}
              style={styles.picker}
            >
              <Picker.Item label="Seleccionar tarea" value="" />
              {tareas.map((t, idx) => (
                <Picker.Item key={idx} label={t.nombre} value={t.nombre} />
              ))}
              {tarea && (
                <Picker.Item label="Eliminar tarea" value="Eliminar" />
              )}
            </Picker>
          ) : (
            <Text style={styles.eventText}>{tarea ? tarea.nombre : '+'}</Text>
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
  container: { flex: 1, backgroundColor: "#F5F5F5", borderRadius: 12, marginBottom: 100 },
  header: { paddingVertical: 20, paddingHorizontal: 10, backgroundColor: "#FFFFFF" },
  headerTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  scheduleContainer: { flexDirection: "row", paddingHorizontal: 10 },
  timeColumn: { width: 80 },
  timeRow: { height: 60, justifyContent: "center" },
  timeText: { fontSize: 14, color: "#333" },
  eventSlot: { height: 60, backgroundColor: "#E8EAF6", borderBottomWidth: 1, borderBottomColor: "#DDD", justifyContent: "center", alignItems: "center", borderRadius: 12 },
  eventText: { fontSize: 16, color: "#000" },
  emptyBlockText: { fontSize: 24, color: "#AAA" },
  picker: { width: "100%", backgroundColor: "#fff" },
});

export default CalendarScreen;