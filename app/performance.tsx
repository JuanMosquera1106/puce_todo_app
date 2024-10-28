import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useTareas } from "../context/TareasContext";
import moment from "moment";

const Performance = () => {
  const { tareas } = useTareas();
  const [tareasCompletadas, setTareasCompletadas] = useState<number>(0);
  const [tareasIncompletas, setTareasIncompletas] = useState<number>(0);
  const [tareasPendientes, setTareasPendientes] = useState<number>(0);
  const [consejos, setConsejos] = useState<string>("");

  useEffect(() => {
    const completadas = tareas.filter((tarea) => tarea.completada).length;
    setTareasCompletadas(completadas);

    const incompletas = tareas.filter(
      (tarea) =>
        tarea.fechaVencimiento < moment().format("YYYY-MM-DD") &&
        !tarea.completada,
    ).length;
    setTareasIncompletas(incompletas);

    const pendientes = tareas.filter(
      (tarea) =>
        !tarea.completada &&
        tarea.fechaVencimiento >= moment().format("YYYY-MM-DD"),
    ).length;
    setTareasPendientes(pendientes);

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

      {/* Rectángulos de información */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Tareas Completadas</Text>
        <Text style={styles.infoValue}>{tareasCompletadas}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Tareas Incompletas</Text>
        <Text style={styles.infoValue}>{tareasIncompletas}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Tareas Pendientes</Text>
        <Text style={styles.infoValue}>{tareasPendientes}</Text>
      </View>

      {/* Gráfico de barras */}
      <BarChart
        data={data}
        width={Dimensions.get("window").width - 32}
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
          marginVertical: 16,
          borderRadius: 16,
        }}
      />

      {/* Consejo */}
      <Text style={styles.consejo}>{consejos}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", // Subir el contenido
    padding: 16,
    paddingTop: 40, // Ajusta la altura superior según necesites
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 10,
  },
  infoBox: {
    width: "100%",
    padding: 16,
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    color: "#00796b",
    fontWeight: "bold",
  },
  infoValue: {
    fontSize: 24,
    color: "#004d40",
    fontWeight: "bold",
    marginTop: 4,
  },
  consejo: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});

export default Performance;
