import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Modal } from "react-native"; // Importar Modal
import Calendario from "../../components/FiltroCalendario";
import ListaTareas from "../../components/ListaTareas";
import BotonAgregarTarea from "../../components/BotonAgregarTarea";
import FormularioTareaModal from "../../components/FormularioTarea";
import Cronometro from "../../components/Cronometro"; // Importamos el cronómetro
import { Tarea } from "../../interfaces/Tarea"; // Importar la interfaz Tarea
import { TareasProvider } from "../../context/TareasContext"; // Asegúrate de que la ruta sea correcta

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

const GestionTareas: React.FC = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [tareaActual, setTareaActual] = useState<Tarea | undefined>(undefined); // Usar undefined en lugar de null
  const [esEditar, setEsEditar] = useState(false);
  const [mostrarCronometro, setMostrarCronometro] = useState(false); // Controla si el cronómetro está visible
  const [tareaCronometro, setTareaCronometro] = useState<Tarea | undefined>(undefined); // Tarea para el cronómetro

  const handleAbrirModal = (tarea: Tarea | undefined) => {
    setTareaActual(tarea);
    setEsEditar(!!tarea); // Es editar si hay una tarea existente
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleIniciarCronometro = (tarea: Tarea) => {
    setTareaCronometro(tarea); // Guardar la tarea que tendrá el cronómetro
    setMostrarCronometro(true); // Mostrar el cronómetro
  };

  const handleCerrarCronometro = () => {
    setMostrarCronometro(false); // Cierra el cronómetro y vuelve a la lista
  };

  return (
    <View style={styles.container}>
      <Header
        fechaSeleccionada={fechaSeleccionada}
        setFechaSeleccionada={setFechaSeleccionada}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <ListaTareas
          fechaSeleccionada={fechaSeleccionada}
          handleAbrirModal={handleAbrirModal}
          handleIniciarCronometro={handleIniciarCronometro} // Pasamos la función de iniciar cronómetro
        />
      </ScrollView>
      <View style={styles.botonContainer}>
        <BotonAgregarTarea onPress={() => handleAbrirModal(undefined)} />
      </View>
      {modalVisible && (
        <FormularioTareaModal
          visible={modalVisible}
          onClose={handleCloseModal}
          tareaInicial={tareaActual} // tareaActual puede ser undefined
          esEditar={esEditar}
        />
      )}

      {/* Modal para mostrar el cronómetro */}
      {mostrarCronometro && (
        <Modal visible={mostrarCronometro} animationType="slide" transparent={true}>
          <Cronometro
            duracion={tareaCronometro?.pomodoro?.duracion || 25} // Asigna la duración de la tarea
            descanso={tareaCronometro?.pomodoro?.descanso || 5} // Asigna el descanso de la tarea
            intervalos={tareaCronometro?.pomodoro?.intervalo || 4} // Asigna los intervalos de la tarea
            onFinish={handleCerrarCronometro} // Al finalizar, cerrar el cronómetro
            onRegresar={handleCerrarCronometro} // Añadimos la opción para cerrar y regresar al listado de tareas
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
    paddingTop: 30, // Espacio en la parte superior del encabezado
    paddingBottom: 10, // Espacio en la parte inferior del encabezado
    backgroundColor: "white", // Asegúrate de que el fondo del encabezado coincida
  },
  scrollViewContent: {
    paddingBottom: 80, // Ajustar el espacio para que no se cubra el botón
  },
  botonContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 5, // Espacio alrededor del botón
  },
});

const Index = () => {
  return (
    <TareasProvider>
      <GestionTareas />
    </TareasProvider>
  );
};

export default Index;
