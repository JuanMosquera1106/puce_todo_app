import React from "react";
import { View, Text, StyleSheet } from "react-native";
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
  const startDate = moment().startOf("week"); // Fecha de inicio de la semana

  // Generar días de la semana (lunes a viernes)
  const weekdays = [];
  for (let i = 0; i < 5; i++) {
    weekdays.push(startDate.clone().add(i, "days")); // Añade lunes a viernes
  }

  return (
    <View style={styles.container}>
      {weekdays.map((day) => {
        const isSelected = day.isSame(fechaSeleccionada, "day");
        const isToday = day.isSame(today, "day"); // Verificar si es hoy

        return (
          <View key={day.format("dddd")} style={styles.dayContainer}>
            <Text
              style={[
                styles.dayText,
                isSelected || isToday // Azul y negrita si está seleccionado o si es hoy
                  ? { color: "blue", fontWeight: "bold" }
                  : { color: "black" }, // Negro si no está seleccionado
              ]}
              onPress={() => setFechaSeleccionada(day.toDate())}
            >
              {day.format("ddd")} {/* Mostrar solo las primeras tres letras */}
            </Text>
          </View>
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
  },
});

export default FiltroSemanal;
