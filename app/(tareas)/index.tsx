import React, { useState } from "react"; // Importar useState
import { ScrollView, View, StyleSheet } from "react-native"; // Importar ScrollView
import Calendario from "../../components/FiltroCalendario";
import ListaTareas from "../../components/ListaTareas";
import BotonAgregarTarea from "../../components/BotonAgregarTarea";
import FormularioTareaModal from "../../components/FormularioTarea";
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

  const handleAbrirModal = (tarea: Tarea | undefined) => {
    setTareaActual(tarea);
    setEsEditar(!!tarea); // Es editar si hay una tarea existente
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
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
