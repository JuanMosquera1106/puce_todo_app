import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from "react-native-reanimated";
import { useCalendar } from "../context/CalendarContext";
import Calendario from "../components/FiltroCalendario";
import { Materia } from "../interfaces/Materia";

// Extender el rango de tiempo hasta las 7:00 PM
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
];

const CalendarScreen: React.FC = () => {
  const { dayEvents, setDayEvents, materiasGlobales } = useCalendar() as unknown as {
    dayEvents: { [key: string]: Materia };
    setDayEvents: React.Dispatch<React.SetStateAction<{ [key: string]: Materia }>>;
    materiasGlobales: Materia[];
  };
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [currentBlock, setCurrentBlock] = useState<string | null>(null);
  const currentTime = useSharedValue<number>(0);

  // Línea azul que se actualiza cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hour * 60 + minutes;
      const position = (totalMinutes - 420) * (60 / 30); // 7:00 AM = 420 minutos
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

  const handleMateriaSelection = (materia: Materia) => {
    if (currentBlock) {
      setDayEvents((prevDayEvents) => {
        const updatedMaterias = { ...prevDayEvents };
        updatedMaterias[currentBlock] = materia;
        return updatedMaterias;
      });
    }
    setModalVisible(false);
  };

  const renderBlocks = () =>
    timeBlocks.map((time, index) => {
      const materia = dayEvents[time];
      const height = useSharedValue(60);

      const animatedHeight = useAnimatedStyle(() => ({
        height: height.value,
      }));

      const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx: any) => {
          ctx.startHeight = height.value;
        },
        onActive: (event, ctx: any) => {
          height.value = Math.max(60, ctx.startHeight + event.translationY);
        },
        onEnd: () => {
          height.value = Math.round(height.value / 60) * 60; // Redondear al bloque más cercano
        },
      });

      return (
        <PanGestureHandler key={index} onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              styles.eventSlot,
              animatedHeight,
              materia && {
                backgroundColor: materia.color as unknown as string,
                borderRadius: 12,
              },
            ]}
          >
            {materia ? (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.eventText}>{String(materia.event)}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setCurrentBlock(time);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.emptyBlockText}>+</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </PanGestureHandler>
      );
    });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar Materia</Text>
              {materiasGlobales.map((materia, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.materiaButton}
                  onPress={() => handleMateriaSelection(materia)}
                >
                  <Text style={styles.materiaText}>{materia.event}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.materiaButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.materiaText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  eventsColumn: {
    flex: 1,
    marginLeft: 10,
  },
  eventSlot: {
    height: 60,
    backgroundColor: "#E8EAF6",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
  },
  eventText: {
    fontSize: 16,
    color: "#000",
  },
  emptyBlockText: {
    fontSize: 24,
    color: "#AAA",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  materiaButton: {
    padding: 12,
    backgroundColor: "#E8EAF6",
    borderRadius: 5,
    marginBottom: 10,
  },
  materiaText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#FFCDD2",
  },
});

export default CalendarScreen;
