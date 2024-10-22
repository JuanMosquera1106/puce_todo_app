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
import Calendario from "../components/FiltroCalendario"; // Importa tu componente de calendario

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

interface DayEvents {
  [date: string]: Events;
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
  "10:00 p. m.",
  "10:30 p. m.",
  "11:00 p. m.",
  "11:30 p. m.",
  "12:00 a. m.",
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

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0]; // Convierte la fecha en formato YYYY-MM-DD
};

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
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date()); // Nueva funcionalidad para manejar la fecha seleccionada
  const [dayEvents, setDayEvents] = useState<DayEvents>({}); // Materias por cada día
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null); // Hora seleccionada para escribir
  const [draggingHeight, setDraggingHeight] = useState<number>(1); // Altura actual del bloque mientras se arrastra
  const [startIndex, setStartIndex] = useState<number | null>(null); // Índice inicial del bloque

  const formattedDate = formatDate(fechaSeleccionada); // Fecha formateada actual

  // Obtener los eventos del día actual o un objeto vacío si no hay
  const events = dayEvents[formattedDate] || {};

  // Manejar el cambio en la materia
  const handleInputChange = (time: string, text: string) => {
    setDayEvents((prevDayEvents) => {
      const updatedEvents = {
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
        [formattedDate]: updatedEvents, // Actualizar solo el día seleccionado
      };
    });
  };

  // Manejar el clic en el bloque de hora
  const handleBlockClick = (time: string, index: number) => {
    setSelectedBlock(time); // Seleccionar el bloque de tiempo para ingresar la materia
    setStartIndex(index); // Guardar el índice del bloque inicial
  };

  // Manejar el movimiento del PanResponder
  const handlePanResponderMove = (e: any, gestureState: any) => {
    const blockHeight = 60; // Altura fija de cada bloque en píxeles (corresponde a 30 minutos)
    const draggedBlocks = Math.round(gestureState.dy / blockHeight); // Calcula cuántos bloques de 30 minutos se arrastraron

    // Calcula la nueva altura y permite que se reduzca, pero nunca por debajo de 1 bloque
    const newHeight = Math.max(1, draggingHeight + draggedBlocks);
    setDraggingHeight(newHeight);
  };

  // Manejar cuando se suelta el bloque
  const handlePanResponderRelease = () => {
    if (selectedBlock !== null && startIndex !== null) {
      setDayEvents((prevDayEvents) => {
        const updatedEvents = { ...prevDayEvents[formattedDate] };
        const timeKey = timeBlocks[startIndex];

        // Comprobar si hay un evento existente y actualizar la duración
        if (updatedEvents[timeKey]) {
          const updatedDuration = Math.max(1, draggingHeight); // Mantener al menos 1 bloque
          updatedEvents[timeKey] = {
            ...updatedEvents[timeKey],
            duration: updatedDuration,
          };
        }

        return {
          ...prevDayEvents,
          [formattedDate]: updatedEvents, // Actualizar solo el día seleccionado
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
      {/* Header con el calendario */}
      <Header
        fechaSeleccionada={fechaSeleccionada}
        setFechaSeleccionada={setFechaSeleccionada}
      />

      {/* Contenido del calendario de bloques */}
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
                          height: event.duration * 60, // Ajusta la altura del bloque
                          backgroundColor: event.color,
                        }
                      : { height: 60 }, // Altura base para bloques vacíos
                  ]}
                  onPress={() => handleBlockClick(time, index)}
                >
                  {isSelected ? (
                    <View style={{ height: draggingHeight * 60 }}>
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
                    </View>
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
  header: {
    paddingTop: 30, // Espacio en la parte superior del encabezado
    paddingBottom: 10, // Espacio en la parte inferior del encabezado
    backgroundColor: "white", // Asegúrate de que el fondo del encabezado coincida
  },
  scheduleContainer: { flexDirection: "row", flex: 1, marginTop: 10 },
  timeColumn: { width: 100, paddingLeft: 20 },
  timeRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    height: 60, // Ajusta la altura para que coincida con las materias
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
    bottom: 0, // Asegura que siempre esté al final
    right: 5, // Ajustar para la posición horizontal
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