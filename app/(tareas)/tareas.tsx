import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ListaTareas from "../../components/ListaTareas";
import BotonAgregarTarea from "../../components/BotonAgregarTarea";
import FormularioTareaModal from "../../components/FormularioTarea";
import Cronometro from "../../components/Cronometro";
import { Tarea } from "../../interfaces/Tarea";

const ListaTareasSimple: React.FC<any> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tareaActual, setTareaActual] = useState<Tarea | undefined>(undefined);
  const [esEditar, setEsEditar] = useState(false);
  const [mostrarCronometro, setMostrarCronometro] = useState(false);
  const [tareaCronometro, setTareaCronometro] = useState<Tarea | undefined>(
    undefined
  );
  const [mostrarCompletadas, setMostrarCompletadas] = useState(true);
  const [mostrarAtrasadas, setMostrarAtrasadas] = useState(true);
  const [mostrarPendientes, setMostrarPendientes] = useState(true);

  const toggleMostrarCompletadas = () =>
    setMostrarCompletadas(!mostrarCompletadas);
  const toggleMostrarAtrasadas = () => setMostrarAtrasadas(!mostrarAtrasadas);
  const toggleMostrarPendientes = () =>
    setMostrarPendientes(!mostrarPendientes);

  const handleAbrirModal = (tarea: Tarea | undefined) => {
    setTareaActual(tarea);
    setEsEditar(!!tarea);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleIniciarCronometro = (tarea: Tarea) => {
    setTareaCronometro(tarea);
    setMostrarCronometro(true);
  };

  const handleCerrarCronometro = () => {
    setMostrarCronometro(false);
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.iconoHamburguesa}
        >
          <MaterialIcons name="menu" size={30} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Lista de Tareas</Text>
      </View>

      {/* Renderiza todas las tareas */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <ListaTareas
          fechaSeleccionada={null}
          handleAbrirModal={handleAbrirModal}
          handleIniciarCronometro={handleIniciarCronometro}
          mostrarCompletadas={mostrarCompletadas}
          mostrarAtrasadas={mostrarAtrasadas}
          mostrarPendientes={mostrarPendientes}
        />
      </ScrollView>

      {/* Botón de agregar tarea */}
      <View style={styles.botonContainer}>
        <BotonAgregarTarea onPress={() => handleAbrirModal(undefined)} />
      </View>

      {/* Modal de formulario de tareas */}
      {modalVisible && (
        <FormularioTareaModal
          visible={modalVisible}
          onClose={handleCloseModal}
          tareaInicial={tareaActual}
          esEditar={esEditar}
        />
      )}

      {/* Modal de cronómetro */}
      {mostrarCronometro && (
        <Modal
          visible={mostrarCronometro}
          animationType="slide"
          transparent={true}
        >
          <Cronometro
            duracion={tareaCronometro?.pomodoro?.duracion || 25}
            descanso={tareaCronometro?.pomodoro?.descanso || 5}
            intervalos={tareaCronometro?.pomodoro?.intervalo || 4}
            onFinish={handleCerrarCronometro}
            onRegresar={handleCerrarCronometro}
          />
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#0891b2",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  scrollViewContent: {
    padding: 15,
    paddingBottom: 80,
  },
  botonContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 15,
  },
  iconoHamburguesa: {
    padding: 5,
  },
});

export default ListaTareasSimple;
