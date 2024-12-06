import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useTareas } from "../context/TareasContext";
import moment from "moment";

const PerformanceDashboard = () => {
  const { tareas } = useTareas();
  const [tareasCompletadas, setTareasCompletadas] = useState<number>(0);
  const [tareasIncompletas, setTareasIncompletas] = useState<number>(0);
  const [tareasPendientes, setTareasPendientes] = useState<number>(0);
  const [consejos, setConsejos] = useState<string>("");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("Pendientes");
  const [tareasFiltradas, setTareasFiltradas] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    // Desenredar las instancias de tareas repetidas
    const todasLasTareas = tareas.flatMap((tarea) => [
      tarea,
      ...(tarea.instancias || []),
    ]);
  
    // Calcular tareas completadas
    const completadas = todasLasTareas.filter((tarea) => tarea.completada).length;
    setTareasCompletadas(completadas);
  
    // Calcular tareas incompletas
    const incompletas = todasLasTareas.filter(
      (tarea) =>
        tarea.fechaVencimiento < moment().format("YYYY-MM-DD") && !tarea.completada
    ).length;
    setTareasIncompletas(incompletas);
  
    // Calcular tareas pendientes
    const pendientes = todasLasTareas.filter(
      (tarea) =>
        !tarea.completada &&
        tarea.fechaVencimiento >= moment().format("YYYY-MM-DD")
    ).length;
    setTareasPendientes(pendientes);
  
    // Generar consejos según el número de tareas completadas
    if (completadas === 0) {
      setConsejos("¡Intenta completar al menos una tarea hoy!");
    } else if (completadas < 5) {
      setConsejos(
        "¡Buen trabajo! Intenta completar más tareas para aumentar tu productividad."
      );
    } else {
      setConsejos("¡Excelente! Sigue así y establece nuevos objetivos.");
    }
  }, [tareas]);  

  useEffect(() => {
    filtrarTareas(estadoSeleccionado);
  }, [estadoSeleccionado, tareas]);

  const filtrarTareas = (estado: string) => {
    // Desenredar todas las tareas, incluyendo instancias
    const todasLasTareas = tareas.flatMap((tarea) => [
      tarea,
      ...(tarea.instancias || []),
    ]);
  
    let filtradas: any[] = [];
    if (estado === "Completas") {
      filtradas = todasLasTareas.filter((tarea) => tarea.completada);
    } else if (estado === "Incompletas") {
      filtradas = todasLasTareas.filter(
        (tarea) =>
          tarea.fechaVencimiento < moment().format("YYYY-MM-DD") &&
          !tarea.completada
      );
    } else if (estado === "Pendientes") {
      filtradas = todasLasTareas.filter(
        (tarea) =>
          !tarea.completada &&
          tarea.fechaVencimiento >= moment().format("YYYY-MM-DD")
      );
    }
    setTareasFiltradas(filtradas);
  };  

  const showModal = () => {
    setModalVisible(true);
    Animated.timing(modalOpacity, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(modalOpacity, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

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
      {/* Botón de consejo con área táctil amplia */}
      <TouchableOpacity style={styles.helpButtonWrapper} onPress={showModal}>
        <View style={styles.helpButton}>
          <Text style={styles.helpButtonText}>?</Text>
        </View>
      </TouchableOpacity>

      {/* Modal para el consejo */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideModal}
      >
        <Animated.View
          style={[
            styles.modalOverlay,
            { opacity: modalOpacity },
          ]}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{consejos}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>

      <Text style={styles.title}>Dashboard de Rendimiento</Text>

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
        }}
        style={{
          marginVertical: 16,
          borderRadius: 16,
        }}
      />

      {/* Botones de filtro */}
      <View style={styles.filterContainer}>
        {["Pendientes", "Completas", "Incompletas"].map((estado) => (
          <TouchableOpacity
            key={estado}
            style={[
              styles.filterButton,
              estadoSeleccionado === estado && styles.selectedButton,
            ]}
            onPress={() => setEstadoSeleccionado(estado)}
          >
            <Text
              style={[
                styles.filterButtonText,
                estadoSeleccionado === estado && styles.selectedButtonText,
              ]}
            >
              {estado}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de tareas con scroll */}
      <FlatList
        data={tareasFiltradas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.nombre}</Text>
            <Text style={styles.taskDate}>
              Vence: {moment(item.fechaVencimiento).format("DD-MM-YYYY")}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No hay tareas en esta categoría.</Text>
        }
        contentContainerStyle={{ paddingBottom: 75}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  helpButtonWrapper: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  helpButton: {
    backgroundColor: "#34ceec",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  helpButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#34ceec",
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  filterButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#34ceec",
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: "#34ceec",
  },
  filterButtonText: {
    color: "#34ceec",
    fontWeight: "bold",
  },
  selectedButtonText: {
    color: "#ffffff",
  },
  taskItem: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskDate: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  emptyMessage: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 20,
  },
});

export default PerformanceDashboard;
