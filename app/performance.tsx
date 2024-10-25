import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useTareas } from "../context/TareasContext";
import moment from "moment";

const Performance = () => {
  const { tareas } = useTareas(); // Obtén las tareas del contexto
  const [tareasCompletadas, setTareasCompletadas] = useState<number>(0);
  const [tareasIncompletas, setTareasIncompletas] = useState<number>(0);
  const [tareasPendientes, setTareasPendientes] = useState<number>(0);
  const [consejos, setConsejos] = useState<string>("");

  useEffect(() => {
    // Calcular tareas completadas
    const completadas = tareas.filter((tarea) => tarea.completada).length;
    setTareasCompletadas(completadas);

    // Calcular tareas incompletas que ya han pasado de la fecha
    const incompletas = tareas.filter(
      (tarea) =>
        tarea.fechaVencimiento < moment().format("YYYY-MM-DD") &&
        !tarea.completada,
    ).length;
    setTareasIncompletas(incompletas);

    // Calcular tareas pendientes (no completadas y con fecha futura)
    const pendientes = tareas.filter(
      (tarea) =>
        !tarea.completada &&
        tarea.fechaVencimiento >= moment().format("YYYY-MM-DD"),
    ).length;
    setTareasPendientes(pendientes);

    // Generar consejos dinámicos
    if (completadas === 0) {
      setConsejos("¡Intenta completar al menos una tarea hoy!");
    } else if (completadas < 5) {
      setConsejos(
        "¡Buen trabajo! Intenta completar más tareas para aumentar tu productividad.",
      );
    } else {
      setConsejos("¡Excelente! Sigue así y establece nuevos objetivos.");
    }
  }, [tareas]);

  const data = {
    labels: ["Completadas", "Incompletas", "Pendientes"],
    datasets: [
      {
        data: [tareasCompletadas, tareasIncompletas, tareasPendientes],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rendimiento de Tareas</Text>
      <BarChart
        data={data}
        width={320}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#f0f0f0",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(34, 202, 236, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#34ceec",
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
      <Text style={styles.consejo}>{consejos}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  consejo: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});

export default Performance;
