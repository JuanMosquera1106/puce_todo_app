import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Calendario from "../../components/FiltroCalendario";
import ListaTareas from "../../components/ListaTareas";
import BotonAgregarTarea from "../../components/BotonAgregarTarea";
import FormularioTareaModal from "../../components/FormularioTarea";
import Cronometro from "../../components/Cronometro";
import Opciones from "../../components/Opciones";
import { Tarea } from "../../interfaces/Tarea";
import HamburgerMenu from "../../components/HamburgerMenu";

interface HeaderProps {
  fechaSeleccionada: Date;
  setFechaSeleccionada: (fecha: Date) => void;
  toggleMostrarCompletadas: () => void;
  toggleMostrarAtrasadas: () => void;
  toggleMostrarPendientes: () => void;
  setIsMenuVisible: (visible: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  fechaSeleccionada,
  setFechaSeleccionada,
  toggleMostrarCompletadas,
  toggleMostrarAtrasadas,
  toggleMostrarPendientes,
  setIsMenuVisible,

}) => {
  const [opcionesModalVisible, setOpcionesModalVisible] = useState(false);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => setIsMenuVisible(true)}
        style={styles.iconoHamburguesa}
      >
        <MaterialIcons name="menu" size={30} color="black" />
      </TouchableOpacity>

      <Calendario
        fechaSeleccionada={fechaSeleccionada}
        setFechaSeleccionada={setFechaSeleccionada}
      />
      <TouchableOpacity
        onPress={() => setOpcionesModalVisible(true)}
        style={styles.iconoOpciones}
      >
        <MaterialIcons name="more-horiz" size={30} color="black" />
      </TouchableOpacity>

      {/* Uso del componente Opciones */}
      <Opciones
        visible={opcionesModalVisible}
        onClose={() => setOpcionesModalVisible(false)}
        mostrarCompletadas={true}
        toggleMostrarCompletadas={toggleMostrarCompletadas}
        mostrarAtrasadas={true}
        toggleMostrarAtrasadas={toggleMostrarAtrasadas}
        mostrarPendientes={true}
        toggleMostrarPendientes={toggleMostrarPendientes}
      />
    </View>
  );
};

const GestionTareas: React.FC = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [tareaActual, setTareaActual] = useState<Tarea | undefined>(undefined);
  const [esEditar, setEsEditar] = useState(false);
  const [mostrarCronometro, setMostrarCronometro] = useState(false);
  const [tareaCronometro, setTareaCronometro] = useState<Tarea | undefined>(
    undefined,
  );
  const [mostrarCompletadas, setMostrarCompletadas] = useState(true);
  const [mostrarAtrasadas, setMostrarAtrasadas] = useState(true);
  const [mostrarPendientes, setMostrarPendientes] = useState(true);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);


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
    <HamburgerMenu isVisible={isMenuVisible} onClose={() => setIsMenuVisible(false)}>
    <View style={styles.container}>
      <Header 
        setIsMenuVisible={setIsMenuVisible}
        fechaSeleccionada={fechaSeleccionada}
        setFechaSeleccionada={setFechaSeleccionada}
        toggleMostrarCompletadas={toggleMostrarCompletadas}
        toggleMostrarAtrasadas={toggleMostrarAtrasadas}
        toggleMostrarPendientes={toggleMostrarPendientes}

      />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <ListaTareas
          fechaSeleccionada={fechaSeleccionada}
          handleAbrirModal={handleAbrirModal}
          handleIniciarCronometro={handleIniciarCronometro}
          mostrarCompletadas={mostrarCompletadas}
          mostrarAtrasadas={mostrarAtrasadas}
          mostrarPendientes={mostrarPendientes}
        />
      </ScrollView>
      <View style={styles.botonContainer}>
        <BotonAgregarTarea onPress={() => handleAbrirModal(undefined)} />
      </View>
      {modalVisible && (
        <FormularioTareaModal
          visible={modalVisible}
          onClose={handleCloseModal}
          tareaInicial={tareaActual}
          esEditar={esEditar}
        />
      )}
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
    </HamburgerMenu>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  header: {
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  iconoOpciones: {
    position: "absolute",
    top: 30,
    right: 10,
    padding: 5,
  },
  scrollViewContent: {
    paddingBottom: 80,
  },
  botonContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    paddingVertical: 8,
    color: "#333",
  },
  closeButton: {
    marginTop: 10,
    color: "blue",
  },
  iconoHamburguesa: {
    position: 'absolute',
    top: 30,
    left: 10,
    padding: 5,
  },
});

export default GestionTareas;
