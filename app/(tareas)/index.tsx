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
import moment from "moment";

interface HeaderProps {
  fechaSeleccionada: Date;
  setFechaSeleccionada: (fecha: Date) => void;
  toggleMostrarCompletadas: () => void;
  toggleMostrarAtrasadas: () => void;
  toggleMostrarPendientes: () => void;
  openDrawer: () => void; // Nuevo: Se pasa la función para abrir el Drawer
}

const Header: React.FC<HeaderProps> = ({
  fechaSeleccionada,
  setFechaSeleccionada,
  toggleMostrarCompletadas,
  toggleMostrarAtrasadas,
  toggleMostrarPendientes,
  openDrawer, // Nuevo
}) => {
  const [opcionesModalVisible, setOpcionesModalVisible] = useState(false);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={openDrawer} // Abre el Drawer cuando se presiona
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

const index: React.FC<any> = ({ navigation }) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
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
    const nuevaFecha = fechaSeleccionada
      ? moment(fechaSeleccionada).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD"); // Usa fecha seleccionada o actual
  
    setTareaActual(
      tarea || {
        id: "",
        nombre: "",
        prioridad: "Media",
        materia: "Ninguna",
        fechaVencimiento: nuevaFecha,
        completada: false,
        pomodoro: { duracion: 25, descanso: 5, intervalo: 1 },
        repetir: "No repetir",
      }
    );
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
      <Header
        openDrawer={() => navigation.openDrawer()} // Nuevo: función para abrir el Drawer
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
          fechaSeleccionada={fechaSeleccionada} // Pasa la fecha seleccionada al formulario
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
    top: 25,
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
  iconoHamburguesa: {
    position: "absolute",
    top: 25,
    left: 10,
    padding: 5,
  },
});

export default index;
