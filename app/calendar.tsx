import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  PanResponder,
} from "react-native";
import { useCalendar } from "../context/CalendarContext"; // Importa el contexto
import Calendario from "../components/FiltroSemanal"; // Importa tu componente de calendario
import { Materia } from "../interfaces/Materia"; // Importa la interfaz Materia

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
  "10:00 p. m.",
  "10:30 p. m.",
  "11:00 p. m.",
  "11:30 p. m.",
  "12:00 a. m.",
];

// Función para obtener un color aleatorio
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

// Formatear la fecha
const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0]; // Convierte la fecha en formato YYYY-MM-DD
};

// Componente Header
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

// Componente principal CalendarScreen
const CalendarScreen: React.FC = () => {
  const { dayEvents, setDayEvents } = useCalendar(); // Usar el contexto
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [draggingHeight, setDraggingHeight] = useState<number>(1);
  const [startIndex, setStartIndex] = useState<number | null>(null);

  const formattedDate = formatDate(fechaSeleccionada);
  const materias: { [key: string]: Materia } = dayEvents[formattedDate] || {}; // Asegúrate de que sea del tipo correcto

  // Manejar el cambio en la materia
  const handleInputChange = (time: string, text: string) => {
    setDayEvents((prevDayEvents) => {
      // Si el texto está vacío, eliminamos la tarea
      if (text.trim() === "") {
        const updatedMaterias = { ...prevDayEvents[formattedDate] };
        delete updatedMaterias[time]; // Eliminamos la tarea vacía
        return {
          ...prevDayEvents,
          [formattedDate]: updatedMaterias,
        };
      }

      // De lo contrario, actualizamos o creamos la tarea
      const updatedMaterias: { [key: string]: Materia } = {
        ...prevDayEvents[formattedDate],
        [time]: {
          time,
          event: text,
          color: getRandomColor(),
          duration: draggingHeight,
        },
      };
      return {
        ...prevDayEvents,
        [formattedDate]: updatedMaterias,
      };
    });
  };

  // Manejar el clic en el bloque de hora
  const handleBlockClick = (time: string, index: number) => {
    setSelectedBlock(time);
    setStartIndex(index);
    setDraggingHeight(materias[time]?.duration || 1);
  };

  // Manejar el movimiento del PanResponder
  const handlePanResponderMove = (e: any, gestureState: any) => {
    const blockHeight = 60; // Altura de cada bloque en píxeles
    const draggedBlocks = Math.round(gestureState.dy / blockHeight);
    const newHeight = Math.max(1, draggingHeight + draggedBlocks);
    setDraggingHeight(newHeight);
  };

  // Manejar cuando se suelta el bloque
  const handlePanResponderRelease = () => {
    if (selectedBlock !== null && startIndex !== null) {
      setDayEvents((prevDayEvents) => {
        const updatedMaterias = { ...prevDayEvents[formattedDate] };
        const timeKey = timeBlocks[startIndex];

        // Actualiza la duración de la materia
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
                        }
                      : { height: 60 },
                  ]}
                  onPress={() => handleBlockClick(time, index)}
                >
                  {isSelected ? (
                    <View style={{ height: draggingHeight * 60 }}>
                      <TextInput
                        style={styles.input}
                        placeholder="Escribir materia"
                        value={materia ? materia.event : ""}
                        maxLength={30} // Limitar a 60 caracteres
                        onChangeText={(text) => handleInputChange(time, text)}
                      />
                      <View
                        {...panResponder.panHandlers}
                        style={styles.dragHandle}
                      >
                        <View style={styles.dragIconContainer}>
                          <View style={styles.dragLine} />
                          <View style={styles.dragLine} />
                        </View>
                      </View>
                    </View>
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

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingBottom: 20 },
  header: {
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  scheduleContainer: { flexDirection: "row", flex: 1, marginTop: 10 },
  timeColumn: { width: 100, paddingLeft: 20 },
  timeRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    height: 60,
    justifyContent: "center",
  },
  timeText: { color: "#000", fontSize: 16 },
  eventsColumn: { flex: 1, marginLeft: 10 },
  eventSlot: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 5,
    position: "relative",
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
    backgroundColor: "#e0e0e0",
    padding: 5,
    alignItems: "center",
    borderRadius: 4,
    position: "absolute",
    bottom: 0,
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
