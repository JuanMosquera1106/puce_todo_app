import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import moment from "moment";
import "moment/locale/es"; // Asegúrate de importar el locale en español

interface CalendarioProps {
  fechaSeleccionada: Date;
  setFechaSeleccionada: (fecha: Date) => void;
}

const FiltroSemanal: React.FC<CalendarioProps> = ({
  fechaSeleccionada,
  setFechaSeleccionada,
}) => {
  const today = moment(); // Fecha de hoy
  const startDate = moment().startOf("week"); // Fecha de inicio de la semana (domingo)

  // Generar días de la semana (domingo a sábado)
  const weekdays = [];
  for (let i = 0; i < 7; i++) {
    weekdays.push(startDate.clone().add(i, "days")); // Añade todos los días de la semana
  }

  return (
    <View style={styles.container}>
      {weekdays.map((day) => {
        const isSelected = day.isSame(fechaSeleccionada, "day");
        const isToday = day.isSame(today, "day"); // Verificar si es hoy

        return (
          <TouchableOpacity
            key={day.format("dddd")}
            style={styles.dayContainer}
            onPress={() => setFechaSeleccionada(day.toDate())}
          >
            <Text
              style={[
                styles.dayText,
                isToday ? styles.todayText : isSelected && styles.selectedText,
              ]}
            >
              {day.format("ddd")}{" "}
              {/* Mostrar solo el nombre del día (Lun, Mar, etc.) */}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around", // Espaciado entre días
    paddingVertical: 20,
    backgroundColor: "transparent", // Fondo transparente
  },
  dayContainer: {
    alignItems: "center",
  },
  dayText: {
    fontSize: 18,
    color: "black",
  },
  todayText: {
    color: "blue",
    fontWeight: "bold",
  },
  selectedText: {
    color: "red",
    fontWeight: "bold",
  },
});

export default FiltroSemanal;
