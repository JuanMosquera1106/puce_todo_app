import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  PanResponder,
  Animated,
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";

// Definición del estado de eventos con duración
interface Event {
  time: string;
  event: string;
  color: string;
  duration: number; // duración en bloques
}

interface Events {
  [time: string]: Event;
}

// Horas del día con intervalos de 30 minutos
const timeBlocks = [
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
];

// Colores aleatorios para las materias
const getRandomColor = (): string => {
  const colors = [
    "#f28b82",
    "#fbbc04",
    "#34a853",
    "#a7ffeb",
    "#cbf0f8",
    "#aecbfa",
    "#d7aefb",
    "#a4c639",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const CalendarScreen: React.FC = () => {
  const [events, setEvents] = useState<Events>({});
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null); // Hora seleccionada para escribir
  const [draggingHeight, setDraggingHeight] = useState<number>(1); // Altura actual del bloque mientras se arrastra

  // Manejar el cambio en la materia
  const handleInputChange = (time: string, text: string) => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [time]: {
        time,
        event: text,
        color: getRandomColor(),
        duration: draggingHeight,
      }, // Duración dinámica
    }));
  };

  // Manejar el clic en el bloque de hora
  const handleBlockClick = (time: string) => {
    setSelectedBlock(time); // Seleccionar el bloque de tiempo para ingresar la materia
  };

  const handlePanResponderMove = (
    e: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    const blockHeight = 60; // Altura fija de cada bloque en píxeles (corresponde a 30 minutos)
    const draggedBlocks = Math.ceil(gestureState.dy / blockHeight); // Calcula cuántos bloques de 30 minutos se arrastraron
    setDraggingHeight(Math.max(1, draggedBlocks)); // Asegura que sea al menos 1 bloque
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: () => {
      // Al soltar, guarda la duración
      setDraggingHeight(1); // Reinicia la altura para el próximo arrastre
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Horario</Text>
      </View>

      <ScrollView>
        <View style={styles.scheduleContainer}>
          {/* Primera columna: Horas */}
          <View style={styles.timeColumn}>
            {timeBlocks.map((time, index) => (
              <View key={index} style={styles.timeRow}>
                <Text style={styles.timeText}>{time}</Text>
              </View>
            ))}
          </View>

          {/* Segunda columna: Materias */}
          <View style={styles.eventsColumn}>
            {timeBlocks.map((time, index) => {
              const event = events[time];
              const isSelected = selectedBlock === time;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.eventSlot,
                    event
                      ? {
                          height: event.duration * 60,
                          backgroundColor: event.color,
                        }
                      : {},
                  ]}
                  onPress={() => handleBlockClick(time)}
                >
                  {isSelected ? (
                    <Animated.View style={{ height: draggingHeight * 60 }}>
                      <TextInput
                        style={styles.input}
                        placeholder="Escribir materia"
                        value={event ? event.event : ""}
                        onChangeText={(text) => handleInputChange(time, text)}
                      />
                      {/* Área de arrastre con ícono */}
                      <View
                        {...panResponder.panHandlers}
                        style={styles.dragHandle}
                      >
                        <View style={styles.dragIconContainer}>
                          <View style={styles.dragLine} />
                          <View style={styles.dragLine} />
                        </View>
                      </View>
                    </Animated.View>
                  ) : (
                    event && <Text style={styles.eventText}>{event.event}</Text>
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
  header: { padding: 20, backgroundColor: "#ffffff", alignItems: "center" },
  headerText: { color: "#000", fontSize: 18, fontWeight: "bold" },
  scheduleContainer: { flexDirection: "row", flex: 1, marginTop: 10 },
  timeColumn: { width: 100, paddingLeft: 20 },
  timeRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  timeText: { color: "#000", fontSize: 16 },
  eventsColumn: { flex: 1, marginLeft: 10 },
  eventSlot: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: "#000",
  },
  eventText: {
    color: "#000",
    fontSize: 16,
  },
  dragHandle: {
    marginTop: 10,
    backgroundColor: "#e0e0e0",
    padding: 5,
    alignItems: "center",
    borderRadius: 4,
    position: "absolute",
    bottom: 5,
    right: 5,
  },
  dragIconContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  dragLine: {
    width: 20,
    height: 3,
    backgroundColor: "#000",
    marginVertical: 2,
  },
});

export default CalendarScreen;
